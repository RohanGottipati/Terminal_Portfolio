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

    expect(screen.getByPlaceholderText("Type rohan, then press Enter")).toBeInTheDocument();
    expect(screen.queryByText("Welcome to Rohan", { exact: false })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");

    expect(
      await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 })
    ).toBeInTheDocument();

    const input = screen.getByLabelText("Portfolio command input");
    await user.type(input, "/about{enter}");

    expect(await screen.findByRole("dialog", { name: "Profile" })).toBeInTheDocument();
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
      expect(screen.queryByRole("dialog", { name: "Profile" })).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText("Shell dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Opened /about")).not.toBeInTheDocument();
  });

  it("runs /skills from suggestions with a single enter press", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });
    await user.type(screen.getByLabelText("Portfolio command input"), "/sk{enter}");

    expect(await screen.findByRole("heading", { name: "Skill Stack" })).toBeInTheDocument();
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

    expect(
      await screen.findByRole("heading", { name: "Experience Timeline" })
    ).toBeInTheDocument();
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

  it("runs /help from the dashboard CTA button", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    const dashboard = within(screen.getByLabelText("Shell dashboard"));
    await user.click(dashboard.getByRole("button", { name: /\/help/i }));

    expect(
      await screen.findByRole("dialog", { name: "Command Directory" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Opened /help").length).toBeGreaterThan(0);
  });

  it("shows top-right contact shortcuts in the terminal chrome", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    const chrome = within(screen.getByRole("group", { name: "Terminal window" }));

    expect(chrome.getByRole("link", { name: "Email Rohan" })).toHaveAttribute(
      "href",
      "mailto:rohan.gottipati@gmail.com"
    );
    expect(chrome.getByRole("link", { name: "View GitHub profile" })).toHaveAttribute(
      "href",
      "https://github.com/RohanGottipati"
    );
    expect(chrome.getByRole("link", { name: "View LinkedIn profile" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/rohangottipati/"
    );
    expect(chrome.getByRole("link", { name: "Open resume PDF" })).toHaveAttribute(
      "href",
      "/resume.pdf"
    );
    expect(chrome.getByText("Email")).toBeInTheDocument();
    expect(chrome.getByText("GitHub")).toBeInTheDocument();
    expect(chrome.getByText("LinkedIn")).toBeInTheDocument();
    expect(chrome.getByText("Resume")).toBeInTheDocument();
  });

  it("recalls previous commands with ArrowUp from the terminal input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/help{enter}");
    const dialog = await screen.findByRole("dialog", { name: "Command Directory" });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });

    const input = screen.getByLabelText("Portfolio command input");
    await waitFor(() => {
      expect(input).toHaveFocus();
    });

    await user.type(input, "/about{enter}");
    const profileDialog = await screen.findByRole("dialog", { name: "Profile" });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(profileDialog).not.toBeInTheDocument();
    });

    await user.keyboard("{ArrowUp}");
    expect(input).toHaveValue("/about");

    await user.keyboard("{ArrowUp}");
    expect(input).toHaveValue("/help");
  });

  it("supports arrow-key navigation across shell controls after commands have run", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/about{enter}");
    const dialog = await screen.findByRole("dialog", { name: "Profile" });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });

    const input = screen.getByLabelText("Portfolio command input");
    await waitFor(() => {
      expect(input).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Email Rohan" })).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "View GitHub profile" })).toHaveFocus();
    });
  });

  it("focuses the first contact action and moves through contact actions with arrow keys", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/contact{enter}");

    const dialog = await screen.findByRole("dialog", { name: "Contact" });
    const scoped = within(dialog);
    const emailLink = scoped.getByRole("link", { name: "rohan.gottipati@gmail.com" });
    const copyButton = scoped.getByRole("button", { name: "Copy email" });

    await waitFor(() => {
      expect(emailLink).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(copyButton).toHaveFocus();
    });
  });

  it("focuses the first help command and moves through help commands with arrow keys", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/help{enter}");

    const dialog = await screen.findByRole("dialog", { name: "Command Directory" });
    const scoped = within(dialog);
    const aboutCommand = scoped.getByRole("button", { name: /\/about/i });
    const experienceCommand = scoped.getByRole("button", { name: /\/experience/i });

    await waitFor(() => {
      expect(aboutCommand).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(experienceCommand).toHaveFocus();
    });
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

  it("supports arrow-key navigation through the project list", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/projects{enter}");

    const dialog = await screen.findByRole("dialog", { name: "Projects" });
    const scoped = within(dialog);
    const firstProject = scoped.getByRole("button", { name: /\/project spectra/i });
    const secondProject = scoped.getByRole("button", { name: /\/project caresync/i });

    await waitFor(() => {
      expect(firstProject).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(secondProject).toHaveFocus();
    });
  });

  it("focuses resume actions and moves through them with arrow keys", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/resume{enter}");

    const dialog = await screen.findByRole("dialog", { name: "Resume" });
    const scoped = within(dialog);
    const openLink = scoped.getByRole("link", { name: "Open in new page" });
    const downloadLink = scoped.getByRole("link", { name: "Download PDF" });

    await waitFor(() => {
      expect(openLink).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(downloadLink).toHaveFocus();
    });
  });

  it("focuses the first experience entry and moves through entries with arrow keys", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/experience{enter}");

    const dialog = await screen.findByRole("dialog", { name: "Experience" });
    const scoped = within(dialog);
    const firstEntry = scoped.getByLabelText("Junior Software Developer at DOUBL");
    const secondEntry = scoped.getByLabelText("Software Developer Intern at DOUBL");

    await waitFor(() => {
      expect(firstEntry).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(secondEntry).toHaveFocus();
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

  it("renders project detail CTA links with the expected hrefs", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Startup input"), "rohan{enter}");
    await screen.findByText("Welcome to Rohan", { exact: false }, { timeout: 3500 });

    await user.type(screen.getByLabelText("Portfolio command input"), "/project spectra{enter}");

    const dialog = await screen.findByRole("dialog", { name: "Spectra" });
    const scoped = within(dialog);

    expect(scoped.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/RohanGottipati/Spectra"
    );
    expect(
      scoped.getByText("Next.js, React, TypeScript, Solana Web3.js, Supabase")
    ).toBeInTheDocument();
    expect(scoped.getByRole("link", { name: "Devpost" })).toHaveAttribute(
      "href",
      "https://devpost.com/software/s-e-n-t-r-a"
    );
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

      expect(screen.getByRole("dialog", { name: /Goodbye/ })).toBeInTheDocument();
      expect(screen.getByLabelText("Portfolio command input")).toBeDisabled();
      expect(screen.queryByLabelText("Keyboard navigation help")).not.toBeInTheDocument();

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
