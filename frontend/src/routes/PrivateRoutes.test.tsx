//App.test.tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivateRoutes from "./PrivateRoutes";
import userEvent from "@testing-library/user-event";
import { render } from "../test/utils/render";

describe("PrivateRoutes", () => {
  // describe -> Used to group the test and used to describe what is currently being tested
  it("should redirect to sign-in page", () => {
    // it or test -> Individual test which is run by Vitest. It can either pass or fail
    // render(<PrivateRoutes />);
    // expect(screen.getByText("sign in")).toBeInTheDocument();
    expect(true).toBe(false);
    // expect -> is used to create assertions. In this context assertions are functions that can be called to assert a statement.
  });
  //   it("should increment the count when icon (+) clicked", async () => {
  //     render(<PrivateRoutes />);
  //     userEvent.click(screen.getByText("+"));
  //     expect(await screen.findByText(/count is: 1/i)).toBeInTheDocument();
  //   });
  //   it("should decrement the count when icon (-) clicked", async () => {
  //     render(<PrivateRoutes />);
  //     userEvent.click(screen.getByText("-"));
  //     expect(await screen.findByText(/count is: -1/i)).toBeInTheDocument();
  //   });
});
