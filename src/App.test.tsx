import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "@/App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("starts locked and boots into the shell after typing rohan", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByPlaceholderText("Type rohan to start")).toBeInTheDocument();
    expect(screen.queryByText("Welcome to Rohan")).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");

    expect(
      await screen.findByText("Welcome to Rohan", {}, { timeout: 2000 })
    ).toBeInTheDocument();

    const input = screen.getByLabelText("Portfolio command input");
    await user.type(input, "/about{enter}");

    expect(await screen.findByText("About Rohan")).toBeInTheDocument();
    expect(screen.getAllByText("Opened /about").length).toBeGreaterThan(0);

    await user.type(input, "/clear{enter}");

    await waitFor(() => {
      expect(screen.queryByText("About Rohan")).not.toBeInTheDocument();
    });

    expect(screen.getByText("No recent activity")).toBeInTheDocument();
  });

  it("runs optional commands like /skills when enter is pressed on an exact match", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", {}, { timeout: 2000 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/skills{enter}");

    expect(await screen.findByText("Skills")).toBeInTheDocument();
    expect(screen.getAllByText("Opened /skills").length).toBeGreaterThan(0);
  });

  it("hydrates a deep-linked command from the URL after booting", async () => {
    window.history.replaceState({}, "", "/?cmd=%2Fproject%20spectra");
    render(<App />);

    expect(
      await screen.findByText(
        "Security-focused analytics layer for AI agents operating on the Solana blockchain.",
        {},
        { timeout: 2000 }
      )
    ).toBeInTheDocument();

    expect(screen.getAllByText("Opened /project spectra").length).toBeGreaterThan(0);
  });
});
