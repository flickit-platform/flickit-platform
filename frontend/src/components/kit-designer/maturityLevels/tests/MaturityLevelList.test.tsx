import { render, fireEvent, screen } from "@testing-library/react";
import MaturityLevelList from "../MaturityLevelList";
import { IMaturityLevel } from "@/types";
import { vi } from "vitest";

// Mock data for maturity levels  id: TId;
const mockMaturityLevels: IMaturityLevel[] = [
  { id: 1, title: "Level 1", description: "Description 1", value: 1, index: 1 },
  { id: 2, title: "Level 2", description: "Description 2", value: 2, index: 2 },
];

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();
const mockOnReorder = vi.fn();

describe("MaturityLevelList", () => {
  beforeEach(() => {
    render(
      <MaturityLevelList
        maturityLevels={mockMaturityLevels}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onReorder={mockOnReorder}
      />,
    );
  });

  it("renders maturity levels correctly", () => {
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Level 2")).toBeInTheDocument();
  });

  it("allows editing a maturity level", () => {
    // Click edit button for Level 1
    fireEvent.click(screen.getAllByTestId("maturity-level-edit-icon")[0]);

    // Change title and description
    fireEvent.change(screen.getByTestId("maturity-level-title"), {
      target: { value: "Updated Level 1" },
    });
    fireEvent.change(screen.getByTestId("maturity-level-description"), {
      target: { value: "Updated Description 1" },
    });

    // Save the changes
    fireEvent.click(screen.getByTestId("maturity-level-check-icon"))

    // Check if onEdit was called with the updated values
    expect(mockOnEdit).toHaveBeenCalledWith({
      id: 1,
      index: 1,
      value: 1,
      title: "Updated Level 1",
      description: "Updated Description 1",
    });
  });

  it("allows deleting a maturity level", () => {
    // Click delete button for Level 1
    fireEvent.click(screen.getAllByTestId("maturity-level-delete-icon")[0]);

    // Check if onDelete was called with the correct id
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });
});
