import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Demo } from "../app/demo";

describe("Calculator", () => {
  it("renders a calculator", () => {
    render(<Demo />);
    const linkElement = screen.getByText(/demo text/);
    console.log(linkElement);
    expect(linkElement).toBeInTheDocument();
  });
});
