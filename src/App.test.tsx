import { act, render, screen, waitFor, within } from "@testing-library/react";
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
    expect(screen.queryByText("Welcome to Rohan", { exact: false })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");

    expect(
      await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 })
    ).toBeInTheDocument();

    const input = screen.getByLabelText("Portfolio command input");
    await user.type(input, "/about{enter}");

    expect(await screen.findByText("Profile")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Bachelor of Computer Science, Big Data Concentration at Wilfrid Laurier University."
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Computer Science student at Wilfrid Laurier University building software with a product-first mindset."
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Builder")).not.toBeInTheDocument();
    expect(screen.getAllByText("Opened /about").length).toBeGreaterThan(0);

    await user.type(input, "/clear{enter}");

    await waitFor(() => {
      expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });

    expect(screen.getByText("No recent activity")).toBeInTheDocument();
  });

  it("runs /skills from suggestions with a single enter press", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });
    await user.type(screen.getByLabelText("Portfolio command input"), "/sk{enter}");

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
        { timeout: 3500 }
      )
    ).toBeInTheDocument();

    expect(screen.getAllByText("Opened /project spectra").length).toBeGreaterThan(0);
  });

  it("removes the extra experience summary copy", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/experience{enter}");

    expect(await screen.findByText("Experience")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Delivered interactive product and growth tooling across demos, messaging reliability, and content operations."
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Recent roles, research, leadership, and teaching work.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "A structured view of software, research, founder, leadership, and teaching experience."
      )
    ).not.toBeInTheDocument();
  });

  it("keeps recent activity limited to the latest three commands", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    const input = screen.getByLabelText("Portfolio command input");

    await user.type(input, "/about{enter}");
    await user.type(input, "/skills{enter}");
    await user.type(input, "/contact{enter}");
    await user.type(input, "/help{enter}");

    const dashboard = within(screen.getByLabelText("Shell dashboard"));

    expect(dashboard.getByText("Opened /help")).toBeInTheDocument();
    expect(dashboard.getByText("Opened /contact")).toBeInTheDocument();
    expect(dashboard.getByText("Opened /skills")).toBeInTheDocument();
    expect(dashboard.queryByText("Opened /about")).not.toBeInTheDocument();
  });

  it("supports navigating back to /projects from project detail", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/project spectra{enter}");
    expect(await screen.findByText("Back to /projects")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to /projects" }));
    await waitFor(() => {
      expect(screen.getAllByText("/project spectra").length).toBeGreaterThan(0);
    });
  });

  it("shows resume preview popup with open and download actions", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/resume{enter}");

    expect(
      await screen.findByRole("heading", { name: "Resume" }, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open in new page" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download PDF" })).toBeInTheDocument();
  });

  it("locks the terminal on /exit and auto-closes the window after 10 seconds", async () => {
    const closeSpy = vi.spyOn(window, "close").mockImplementation(() => undefined);
    vi.useFakeTimers();

    try {
      window.history.replaceState({}, "", "/?cmd=%2Fexit");
      render(<App />);

      await act(async () => {
        vi.advanceTimersByTime(120 * 5 + 300);
      });

      expect(screen.getByRole("heading", { name: /Goodbye/ })).toBeInTheDocument();
      expect(screen.getByLabelText("Portfolio command input")).toBeDisabled();

      await act(async () => {
        vi.advanceTimersByTime(9_000);
      });
      expect(closeSpy).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(1_500);
      });

      expect(closeSpy).toHaveBeenCalledTimes(1);
    } finally {
      closeSpy.mockRestore();
      vi.useRealTimers();
    }
  });
});
