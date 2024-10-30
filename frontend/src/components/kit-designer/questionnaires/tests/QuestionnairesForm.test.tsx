import { render, screen } from "@testing-library/react";
import QuestionnairesForm from "../QuestionnairesForm";
import { describe, it, vi, expect } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import userEvent from "@testing-library/user-event";

describe("QuestionnairesForm", ()=> {
  const newItem = {
    title: "title test",
    description: "description test",
    index: 1,
    value: 2,
  };

   const handleInputChange = vi.fn();
   const handleSave= vi.fn();
   const handleCancel= vi.fn();

   const renderForm = () =>{
     render(
         <I18nextProvider i18n={i18n}>
           <QuestionnairesForm
               newItem={newItem}
               handleInputChange={handleInputChange}
               handleSave={handleSave}
               handleCancel={handleCancel}
           />
         </I18nextProvider>
     )
   }
   it("renders with initial values", async ()=>{
     renderForm();
     const titleInput = screen.getByTestId("questionnaires-title");
     const descriptionInput = screen.getByTestId("questionnaires-description");
     const valueInput = screen.getByTestId("questionnaires-value");

     expect(titleInput).toBeInTheDocument();
     expect(titleInput).toHaveValue("title test")

     expect(descriptionInput).toBeInTheDocument();
     expect(descriptionInput).toHaveValue("description test")

     expect(valueInput).toBeInTheDocument();
     expect(valueInput).toHaveValue(2)
   })

    it("calls handleSave when clicking the save button", async ()=> {
        renderForm();

        const saveButton = screen.getByTestId("questionnaires-check-icon");
        await userEvent.click(saveButton);
        expect(handleSave).toHaveBeenCalled();
    })
    it("calls handleCancel when clicking the cancel button", async ()=> {
        renderForm()

        const cancelButton = screen.getByTestId("questionnaires-close-icon")
        await userEvent.click(cancelButton);
        expect(handleCancel).toHaveBeenCalled();

    });
})