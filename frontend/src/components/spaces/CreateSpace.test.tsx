import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CreateSpaceDialog from "./CreateSpaceDialog";
import { ServiceProvider, useServiceContext } from "@providers/ServiceProvider";
import { ToastContainer } from "react-toastify";
import axios from "axios";

vi.mock("@providers/ServiceProvider", () => ({
  useServiceContext: () => ({
    service: {
      createSpace: vi.fn().mockResolvedValue({ data: { id: 1 } }),
      updateSpace: vi.fn().mockResolvedValue({}),
      seenSpaceList: vi.fn().mockResolvedValue({}),
    },
  }),
}));

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("CreateSpaceDialog", () => {
  it("renders input field, buttons and handles submission properly", async () => {
    const mockOnClose = vi.fn();
    const mockOnSubmitForm = vi.fn();
    axios.post = vi.fn().mockResolvedValue({ data: { id: 1 } });

    render(
      <MemoryRouter>
        <ServiceProvider>
          <CreateSpaceDialog
            open={true}
            onClose={mockOnClose}
            onSubmitForm={mockOnSubmitForm}
          />
        </ServiceProvider>
        <ToastContainer />
      </MemoryRouter>,
    );

    const inputContainer = screen.getByTestId("input-title");
    expect(inputContainer).toBeInTheDocument();

    const inputElement = inputContainer.querySelector("input");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "text");

    if (inputElement) {
      await userEvent.clear(inputElement);
      await userEvent.type(inputElement, "New Space");
      expect(inputElement).toHaveValue("New Space");
    }

    const submitButton = screen.getByTestId("submit");
    const cancelButton = screen.getByTestId("cancel");
    expect(submitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect((axios as any).default.post).toHaveBeenCalledTimes(1);
      expect((axios as any).default.post).toHaveBeenCalledWith(
        "/api/v1/spaces/",
        { title: "New Space" },
        expect.anything(),
      );
    });

    expect(mockOnSubmitForm).toHaveBeenCalledTimes(1);
  });

  it("calls closeDialog when the cancel button is clicked", async () => {
    const mockOnClose = vi.fn();
    const mockOnSubmitForm = vi.fn();

    render(
      <MemoryRouter>
        <ServiceProvider>
          <CreateSpaceDialog
            open={true}
            onClose={mockOnClose}
            onSubmitForm={mockOnSubmitForm}
          />
        </ServiceProvider>
        <ToastContainer />
      </MemoryRouter>,
    );

    const cancelButton = screen.getByTestId("cancel");
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("renders input field, pre-fills data for update, and handles submission properly", async () => {
    const mockOnClose = vi.fn();
    const mockOnSubmitForm = vi.fn();
    const mockContext = {
      type: "update",
      data: {
        id: 1,
        title: "Existing Space",
      },
    };

    // Mock axios.put for the update operation
    axios.put = vi.fn().mockResolvedValue({ data: { id: 1 } });

    render(
      <MemoryRouter>
        <ServiceProvider>
          <CreateSpaceDialog
            open={true}
            onClose={mockOnClose}
            onSubmitForm={mockOnSubmitForm}
            context={mockContext}
          />
        </ServiceProvider>
        <ToastContainer />
      </MemoryRouter>,
    );

    const inputContainer = screen.getByTestId("input-title");
    expect(inputContainer).toBeInTheDocument();

    const inputElement = inputContainer.querySelector("input");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "text");

    expect(inputElement).toHaveValue("Existing Space");

    if (inputElement) {
      await userEvent.clear(inputElement);
      await userEvent.type(inputElement, "Updated Space");
      expect(inputElement).toHaveValue("Updated Space");
    }

    const submitButton = screen.getByTestId("submit");
    const cancelButton = screen.getByTestId("cancel");
    expect(submitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `/api/v1/spaces/${mockContext.data.id}/`,
        { title: "Updated Space" },
        expect.anything(),
      );
      expect(axios.put).toHaveBeenCalled();
      expect(axios.put).toHaveBeenCalledWith(
        `/api/v1/spaces/${mockContext.data.id}/seen/`,
        expect.anything(),
      );
    });

    expect(mockOnSubmitForm).toHaveBeenCalledTimes(1);
  });
});
