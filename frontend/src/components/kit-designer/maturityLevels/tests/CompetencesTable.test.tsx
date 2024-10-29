import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CompetencesTable from "../CompetencesTable"; // Adjust the import based on your file structure
import { vi } from "vitest";
import { ServiceProvider } from "@/providers/ServiceProvider"; // Import your ServiceProvider
import axios from "axios";

// Mock data for testing
const mockData = [
  {
    id: 1,
    title: "Maturity Level 1",
    competences: [{ maturityLevelId: 2, value: 5 }],
  },
  {
    id: 2,
    title: "Maturity Level 2",
    competences: [{ maturityLevelId: 1, value: 10 }],
  },
];

const mockMaturityLevelsCompetences = {
  query: vi.fn(),
};

const mockKitVersionId = 1;
const mockLevelCompetencesId = 1;

const mockService = {
  addCompetencyToMaturityLevel: vi.fn(),
  deleteCompetencyOfMaturityLevel: vi.fn(),
  updateCompetencyOfMaturityLevel: vi.fn(),
};

const MockServiceProvider = ({ children }: any) => {
  return <ServiceProvider>{children}</ServiceProvider>;
};

describe("CompetencesTable", () => {
  it("renders the table with data", () => {
    render(
      <MockServiceProvider>
        <CompetencesTable
          data={mockData}
          maturityLevelsCompetences={mockMaturityLevelsCompetences}
          kitVersionId={mockKitVersionId}
        />
      </MockServiceProvider>,
    );

    expect(screen.getAllByText("Maturity Level 1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Maturity Level 2")[0]).toBeInTheDocument();
    expect(screen.getAllByText("5")[0]).toBeInTheDocument();
    expect(screen.getAllByText("10")[0]).toBeInTheDocument();
  });
  
  it("handles adding a new competency", async () => {
    axios.post = vi.fn().mockResolvedValue({});
    render(
      <MockServiceProvider>
        <CompetencesTable
          data={mockData}
          maturityLevelsCompetences={mockMaturityLevelsCompetences}
          kitVersionId={mockKitVersionId}
        />
      </MockServiceProvider>,
    );

    // Click on the cell to add a new competency
    const cell = screen.getAllByText("-")[0].closest("td");
    if (cell) {
      fireEvent.click(cell);
    }

    // Check that the TextField is displayed
    const input = screen.getAllByDisplayValue("")[0];
    fireEvent.change(input, { target: { value: "20" } });
    fireEvent.blur(input); // Trigger save on blur

    // Wait for the service method to be called
    await waitFor(() => {
      expect((axios as any).default.post).toHaveBeenCalledTimes(1);
      expect((axios as any).default.post).toHaveBeenCalledWith(
        `/api/v1/kit-versions/${mockKitVersionId}/level-competences/`,
        {
          affectedLevelId: 1,
          effectiveLevelId: 1,
          kitVersionId: mockKitVersionId,
          value: 20,
        },
        undefined,
      );
    });
  });
});
