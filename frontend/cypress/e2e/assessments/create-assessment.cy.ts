/// <reference types="cypress" />

context("Create an assessment", () => {
  beforeEach(() => {
    cy.loginByApi();
  });

  it("Create an assessment in space", () => {
    cy.visit("/spaces");
    cy.get("[data-cy=space-card-link]").contains("cy-space-test").click();

    cy.wait(2000);

    cy.ifElementExist("[data-cy=assessment-card]", ($elem) => {
      cy.wrap($elem)
        .find("[data-cy=assessment-card-title]")
        .then(($title) => {
          if ($title.text().includes("cy-test-assessment")) {
            cy.wrap($elem).find("[data-cy=more-action-btn]").click();
            cy.wrap($elem).get("[data-cy=delete-action-btn]").click();
          }
        });
    });

    cy.wait(1000);
    cy.get("[data-cy=create-assessment-btn]").click();
    cy.wait(500);
    cy.get("[data-cy=title]").type("cy-test-assessment");
    cy.get("[data-cy=profile]").type("Common Profile").trigger("keydown", {
      key: "Enter",
    });
    cy.get("[data-cy=submit]").click();
    cy.wait(1000);
    cy.get("[data-cy=questionnaires-btn]").click();
    cy.wait(3000);
    cy.get("[data-cy=questionnaire-DevOps-start-btn]").click({ force: true });
    cy.wait(3000);

    cy.get("[data-cy=automatic-submit-check]").click();

    cy.runXTimesEveryYSeconds(() => {
      cy.get("[data-cy=answer-option]").contains("yes").click();
    }, 6);

    cy.get("[data-cy=nav-bar]").contains("Spaces").click();
    cy.wait(1000);
    cy.get("[data-cy=view-insights-btn]").click();

    cy.get('[data-cy="status"]')
      .then(($els) => [...$els].map((el) => el.innerText.trim()))
      .should("include", "WEAK");
  });
});
