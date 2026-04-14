import { portfolioData } from "@/data/portfolio";
import { commandRegistry, createCommandContext } from "@/lib/commands/registry";
import type {
  CommandDefinition,
  CommandResult,
  HistoryEntry,
  ParsedCommand,
} from "@/types/terminal";

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `entry-${Date.now()}-${Math.random()}`;
}

export function normalizeInput(rawInput: string) {
  return rawInput.trim().replace(/\s+/g, " ");
}

export function parseCommand(rawInput: string): ParsedCommand | null {
  const normalizedInput = normalizeInput(rawInput);
  if (!normalizedInput || !normalizedInput.startsWith("/")) {
    return null;
  }

  const [command = "", ...args] = normalizedInput.split(" ");

  return {
    rawInput,
    normalizedInput,
    command: command.toLowerCase(),
    args,
    argText: args.join(" ").trim(),
  };
}

export function resolveCommand(
  parsed: ParsedCommand,
  registry: CommandDefinition[] = commandRegistry
) {
  return (
    registry.find(
      (definition) =>
        definition.command === parsed.command || definition.aliases.includes(parsed.command)
    ) ?? null
  );
}

function buildUnknownCommandResult(parsed: ParsedCommand): CommandResult {
  const suggestions = commandRegistry
    .filter((definition) => definition.command.includes(parsed.command.slice(1)))
    .map((definition) => definition.command)
    .slice(0, 4);

  return {
    type: "systemMessage",
    status: "error",
    title: "Command Not Found",
    description: "The command is not registered in this shell.",
    payload: {
      message: `"${parsed.command}" is not a registered command.`,
      hint: "Run /help or type / to inspect the command menu.",
      suggestions: suggestions.length ? suggestions : ["/help", "/about", "/projects"],
    },
    meta: {
      canonicalCommand: parsed.normalizedInput,
    },
  };
}

export function executeCommand(input: string) {
  const parsed = parseCommand(input);

  if (!parsed) {
    return {
      parsed: null,
      result: {
        type: "systemMessage",
        status: "error",
        title: "Use Slash Commands",
        description: "Commands in this portfolio start with /. ",
        payload: {
          message: "This interface is command-driven.",
          hint: "Start with /help, /about, or just type / to open the menu.",
          suggestions: ["/help", "/about", "/projects"],
        },
        meta: {
          canonicalCommand: null,
        },
      } as CommandResult,
    };
  }

  const definition = resolveCommand(parsed);
  if (!definition) {
    return {
      parsed,
      result: buildUnknownCommandResult(parsed),
    };
  }

  const context = createCommandContext();
  const result = definition.handler(parsed, context);
  const canonicalCommand =
    result.meta?.canonicalCommand === undefined
      ? [definition.command, parsed.argText].filter(Boolean).join(" ")
      : result.meta?.canonicalCommand;

  return {
    parsed,
    result: {
      ...result,
      meta: {
        ...result.meta,
        canonicalCommand,
      },
    },
  };
}

export function createHistoryEntry(
  input: string | null,
  parsed: ParsedCommand | null,
  result: CommandResult
): HistoryEntry {
  return {
    id: createId(),
    input,
    parsed,
    result,
    createdAt: Date.now(),
  };
}

export function createWelcomeEntry(): HistoryEntry {
  return {
    ...createHistoryEntry(null, null, {
      type: "welcome",
      status: "info",
      title: "Welcome",
      description: portfolioData.identity.tagline,
      payload: {
        heading: `Welcome to ${portfolioData.identity.shortName}`,
        subheading:
          "Type / to open the command menu. Start with /about, /projects, or /experience.",
        quickCommands: portfolioData.pinnedCommands,
      },
      meta: {
        canonicalCommand: null,
      },
    }),
  };
}
