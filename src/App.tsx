import {
  startTransition,
  useDeferredValue,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { AnimatePresence } from "framer-motion";

import { CommandMenu } from "@/components/terminal/CommandMenu";
import { TerminalHistory } from "@/components/terminal/TerminalHistory";
import { TerminalInput } from "@/components/terminal/TerminalInput";
import { portfolioData } from "@/data/portfolio";
import {
  createHistoryEntry,
  createWelcomeEntry,
  executeCommand,
  normalizeInput,
} from "@/lib/commands/execute";
import { commandRegistry } from "@/lib/commands/registry";
import { getSuggestions } from "@/lib/commands/suggestions";
import {
  getCommandFromUrl,
  pushCommandToUrl,
  replaceCommandInUrl,
} from "@/lib/commands/url";
import type { HistoryEntry, SuggestionItem } from "@/types/terminal";

interface TerminalState {
  input: string;
  history: HistoryEntry[];
  submittedHistory: string[];
  recallIndex: number;
  selectedSuggestionIndex: number;
  isMenuOpen: boolean;
}

type TerminalAction =
  | { type: "set-input"; value: string; openMenu: boolean }
  | { type: "set-menu-open"; open: boolean }
  | { type: "set-selected-suggestion"; index: number }
  | { type: "append-entry"; entry: HistoryEntry; command: string }
  | { type: "replace-history"; entry: HistoryEntry; command: string }
  | { type: "clear-visible-history" }
  | { type: "set-recall"; value: string; index: number };

const initialState: TerminalState = {
  input: "",
  history: [createWelcomeEntry()],
  submittedHistory: [],
  recallIndex: -1,
  selectedSuggestionIndex: 0,
  isMenuOpen: false,
};

function reducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case "set-input":
      return {
        ...state,
        input: action.value,
        recallIndex: -1,
        isMenuOpen: action.openMenu,
        selectedSuggestionIndex: 0,
      };
    case "set-menu-open":
      return {
        ...state,
        isMenuOpen: action.open,
        selectedSuggestionIndex: action.open ? state.selectedSuggestionIndex : 0,
      };
    case "set-selected-suggestion":
      return {
        ...state,
        selectedSuggestionIndex: action.index,
      };
    case "append-entry":
      return {
        ...state,
        input: "",
        isMenuOpen: false,
        selectedSuggestionIndex: 0,
        recallIndex: -1,
        history: [...state.history, action.entry],
        submittedHistory: [...state.submittedHistory, action.command],
      };
    case "replace-history":
      return {
        ...state,
        input: "",
        isMenuOpen: false,
        selectedSuggestionIndex: 0,
        recallIndex: -1,
        history: [createWelcomeEntry(), action.entry],
        submittedHistory: [...state.submittedHistory, action.command],
      };
    case "clear-visible-history":
      return {
        ...state,
        input: "",
        isMenuOpen: false,
        selectedSuggestionIndex: 0,
        recallIndex: -1,
        history: [createWelcomeEntry()],
      };
    case "set-recall":
      return {
        ...state,
        input: action.value,
        recallIndex: action.index,
        isMenuOpen: action.value.trimStart().startsWith("/"),
        selectedSuggestionIndex: 0,
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const deferredInput = useDeferredValue(state.input);
  const historyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasHydratedRef = useRef(false);

  const suggestions = getSuggestions(deferredInput, commandRegistry, portfolioData);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const container = historyRef.current;
    if (!container) {
      return;
    }

    if (typeof container.scrollTo === "function") {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [state.history]);

  useEffect(() => {
    if (suggestions.length === 0 && state.selectedSuggestionIndex !== 0) {
      dispatch({ type: "set-selected-suggestion", index: 0 });
    }

    if (suggestions.length && state.selectedSuggestionIndex > suggestions.length - 1) {
      dispatch({ type: "set-selected-suggestion", index: 0 });
    }
  }, [state.selectedSuggestionIndex, suggestions]);

  function syncUrl(command: string | null, mode: "push" | "replace" | "none") {
    if (mode === "none") {
      return;
    }

    if (mode === "replace") {
      replaceCommandInUrl(command);
      return;
    }

    pushCommandToUrl(command);
  }

  function runCommand(
    rawInput: string,
    options: { historyMode?: "append" | "replace"; urlMode?: "push" | "replace" | "none" } = {}
  ) {
    const { parsed, result } = executeCommand(rawInput);
    const normalized = normalizeInput(rawInput);

    if (!parsed) {
      const entry = createHistoryEntry(normalized || rawInput, parsed, result);
      startTransition(() => {
        dispatch({ type: "append-entry", entry, command: normalized || rawInput });
      });
      syncUrl(result.meta?.canonicalCommand ?? null, options.urlMode ?? "push");
      return;
    }

    if (result.meta?.clearHistory) {
      startTransition(() => {
        dispatch({ type: "clear-visible-history" });
      });
      syncUrl(null, options.urlMode ?? "push");
      return;
    }

    const entry = createHistoryEntry(normalized, parsed, result);
    const historyMode = options.historyMode ?? "append";

    startTransition(() => {
      dispatch({
        type: historyMode === "replace" ? "replace-history" : "append-entry",
        entry,
        command: normalized,
      });
    });

    syncUrl(result.meta?.canonicalCommand ?? normalized, options.urlMode ?? "push");
  }

  function applySuggestion(item: SuggestionItem, shouldSubmit: boolean) {
    const nextValue =
      item.submitOnSelect || shouldSubmit
        ? item.value
        : `${item.value}${item.kind === "command" ? " " : ""}`;

    dispatch({
      type: "set-input",
      value: nextValue,
      openMenu: nextValue.trimStart().startsWith("/"),
    });

    window.requestAnimationFrame(() => inputRef.current?.focus());

    if (shouldSubmit && item.submitOnSelect) {
      runCommand(item.value);
    }
  }

  function recallCommand(direction: "up" | "down") {
    if (!state.submittedHistory.length) {
      return;
    }

    if (direction === "up") {
      const nextIndex =
        state.recallIndex === -1
          ? state.submittedHistory.length - 1
          : Math.max(0, state.recallIndex - 1);

      dispatch({
        type: "set-recall",
        value: state.submittedHistory[nextIndex],
        index: nextIndex,
      });

      return;
    }

    if (state.recallIndex === -1) {
      return;
    }

    if (state.recallIndex === state.submittedHistory.length - 1) {
      dispatch({ type: "set-recall", value: "", index: -1 });
      return;
    }

    const nextIndex = state.recallIndex + 1;
    dispatch({
      type: "set-recall",
      value: state.submittedHistory[nextIndex],
      index: nextIndex,
    });
  }

  useEffect(() => {
    if (hasHydratedRef.current) {
      return;
    }

    hasHydratedRef.current = true;

    const command = getCommandFromUrl();
    if (command) {
      runCommand(command, { historyMode: "replace", urlMode: "replace" });
    }
  }, []);

  useEffect(() => {
    function handlePopState() {
      const command = getCommandFromUrl();
      if (!command) {
        dispatch({ type: "clear-visible-history" });
        return;
      }

      runCommand(command, { historyMode: "replace", urlMode: "none" });
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="app-shell">
      <div className="app-frame">
        <section className="terminal-panel">
          <div className="terminal-toolbar">
            <div className="terminal-lights">
              <span className="terminal-light bg-rose-400" />
              <span className="terminal-light bg-amber-300" />
              <span className="terminal-light bg-emerald-400" />
            </div>

            <div className="terminal-toolbar-body">
              <div>
                <p className="terminal-toolbar-title">{portfolioData.identity.name}</p>
                <p className="terminal-toolbar-subtitle">
                  {portfolioData.identity.role} · type <code>/</code> to explore
                </p>
              </div>

              <div className="terminal-toolbar-links">
                {portfolioData.quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="terminal-toolbar-link"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    download={link.download}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div ref={historyRef} className="terminal-history">
            <TerminalHistory history={state.history} onRunCommand={runCommand} />
          </div>

          <div className="terminal-input-area">
            <AnimatePresence>
              {state.isMenuOpen ? (
                <CommandMenu
                  suggestions={suggestions}
                  selectedIndex={state.selectedSuggestionIndex}
                  onSelect={(item) => applySuggestion(item, item.submitOnSelect ?? false)}
                />
              ) : null}
            </AnimatePresence>

            <TerminalInput
              value={state.input}
              inputRef={inputRef}
              onChange={(value) =>
                dispatch({
                  type: "set-input",
                  value,
                  openMenu: value.trimStart().startsWith("/"),
                })
              }
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && state.isMenuOpen) {
                  event.preventDefault();
                  dispatch({
                    type: "set-selected-suggestion",
                    index:
                      suggestions.length === 0
                        ? 0
                        : (state.selectedSuggestionIndex + 1) % suggestions.length,
                  });
                  return;
                }

                if (event.key === "ArrowUp" && state.isMenuOpen) {
                  event.preventDefault();
                  dispatch({
                    type: "set-selected-suggestion",
                    index:
                      suggestions.length === 0
                        ? 0
                        : (state.selectedSuggestionIndex - 1 + suggestions.length) %
                          suggestions.length,
                  });
                  return;
                }

                if (event.key === "Tab" && state.isMenuOpen && suggestions.length) {
                  event.preventDefault();
                  applySuggestion(suggestions[state.selectedSuggestionIndex], false);
                  return;
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  dispatch({ type: "set-menu-open", open: false });
                  return;
                }

                if (event.key === "Enter") {
                  event.preventDefault();

                  if (state.isMenuOpen && suggestions.length) {
                    applySuggestion(suggestions[state.selectedSuggestionIndex], true);
                    return;
                  }

                  if (state.input.trim()) {
                    runCommand(state.input);
                  }

                  return;
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  recallCommand("up");
                  return;
                }

                if (event.key === "ArrowDown" && !state.isMenuOpen) {
                  event.preventDefault();
                  recallCommand("down");
                }
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
