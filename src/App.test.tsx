import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "@/App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders the welcome state and can run commands", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Welcome to Rohan")).toBeInTheDocument();

    const input = screen.getByLabelText("Portfolio command input");
    await user.type(input, "/about{enter}");

    expect(
      await screen.findByText("Software Developer Intern at DOUBL and OneChart")
    ).toBeInTheDocument();

    await user.type(input, "/clear{enter}");

    expect(screen.getByText("Welcome to Rohan")).toBeInTheDocument();
    expect(
      screen.queryByText("Software Developer Intern at DOUBL and OneChart")
    ).not.toBeInTheDocument();
  });

  it("hydrates a deep-linked command from the URL", async () => {
    window.history.replaceState({}, "", "/?cmd=%2Fproject%20spectra");
    render(<App />);

    expect(
      await screen.findByText(
        "Security-focused analytics layer for AI agents operating on the Solana blockchain."
      )
    ).toBeInTheDocument();
  });
});
