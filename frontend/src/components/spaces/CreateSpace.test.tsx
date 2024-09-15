import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CreateSpaceDialog from "./CreateSpaceDialog";
import { ServiceProvider } from "@providers/ServiceProvider";
import { ToastContainer } from "react-toastify";

vi.mock("@providers/ServiceProvider", () => ({
    useServiceContext: () => ({
        service: {
            createSpace: vi.fn(),
            updateSpace: vi.fn(),
            seenSpaceList: vi.fn(),
        },
    }),
}));

describe("CreateSpaceDialog", () => {
    it("renders the input field and buttons properly", async () => {
        const mockOnSubmitForm = vi.fn();

        render(
            <MemoryRouter>
                <ServiceProvider>
                    <CreateSpaceDialog
                        open={true}
                        onClose={vi.fn()}
                        onSubmitForm={mockOnSubmitForm}
                    />
                </ServiceProvider>
            </MemoryRouter>,
            { wrapper: ({ children }) => <>{children}<ToastContainer /></> }
        );

        const inputContainer = screen.getByTestId("input-title");
        expect(inputContainer).toBeInTheDocument();

        const inputElement = inputContainer.querySelector("input");
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveAttribute("type", "text");

        if (inputElement) {
            await userEvent.type(inputElement, "New Space");
            expect(inputElement).toHaveValue("New Space");
        }

        const submitButton = screen.getByTestId("submit");
        const cancelButton = screen.getByTestId("cancel");
        expect(submitButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();

    });
});
