import { executeCommand, parseCommand } from "@/lib/commands/execute";

describe("command execution", () => {
  it("parses argument commands correctly", () => {
    expect(parseCommand("/project spectra")).toEqual({
      rawInput: "/project spectra",
      normalizedInput: "/project spectra",
      command: "/project",
      args: ["spectra"],
      argText: "spectra",
    });
  });

  it("canonicalizes aliases to the primary command", () => {
    const { result } = executeCommand("/cv");

    expect(result.title).toBe("Resume");
    expect(result.modal?.title).toBe("Resume");
    expect(result.meta?.canonicalCommand).toBe("/resume");
  });

  it("returns a shell error for plain text input", () => {
    const { result } = executeCommand("about");

    expect(result.title).toBe("Use Slash Commands");
    expect(result.status).toBe("error");
    expect(result.modal).toBeNull();
    expect(result.logLine).toBe("Commands in the shell must start with /.");
  });
});
