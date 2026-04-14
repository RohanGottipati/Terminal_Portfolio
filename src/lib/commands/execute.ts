import { commandRegistry, createCommandContext } from "@/lib/commands/registry";
import type {
  CommandDefinition,
  CommandExecutionResult,
  ParsedCommand,
  SessionLogEntry,
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

function buildUnknownCommandResult(parsed: ParsedCommand): CommandExecutionResult {
  const suggestions = commandRegistry
    .filter((definition) => definition.command.includes(parsed.command.slice(1)))
    .map((definition) => definition.command)
    .slice(0, 3);

  return {
    status: "error",
    title: "Command Not Found",
    description: "The command is not registered in this shell.",
    logLine: suggestions.length
      ? `Unknown command ${parsed.command}. Try ${suggestions.join(", ")}.`
      : `Unknown command ${parsed.command}. Try /help.`,
    modal: null,
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
        status: "error",
        title: "Use Slash Commands",
        description: "Commands in this portfolio start with /.",
        logLine: "Commands in the shell must start with /.",
        modal: null,
        meta: {
          canonicalCommand: null,
        },
      } as CommandExecutionResult,
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

export function createSessionLogEntry(
  input: string,
  result: CommandExecutionResult
): SessionLogEntry {
  return {
    id: createId(),
    input,
    summary: result.logLine,
    status: result.status,
    createdAt: Date.now(),
  };
}
