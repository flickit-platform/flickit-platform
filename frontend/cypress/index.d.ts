/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Logs-in user by using API request
     */
    loginByApi(username?: string, password?: string): Chainable<Response>;
  }
}
