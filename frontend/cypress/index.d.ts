/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Logs-in user by using API request
     */
    loginByApi(username?: string, password?: string): Chainable<Response>;

    /**
     * Checks if selected element exist then fires the callback function
     */
    ifElementExist(
      selector: string,
      cb: (element: JQuery<any>) => Chainable<Response> | void
    ): Chainable<Response>;

    /**
     * Run the callback X time and wait Y time before running it again
     */
    runXTimesEveryYSeconds(
      cb: () => void,
      iterationCount: number,
      timeBetweenEachIteration?: number
    ): void;
  }
}
