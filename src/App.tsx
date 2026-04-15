import {
  startTransition,
  useDeferredValue,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CommandMenu } from "@/components/terminal/CommandMenu";
import { TerminalDashboard } from "@/components/terminal/TerminalDashboard";
import { TerminalHistory } from "@/components/terminal/TerminalHistory";
import { TerminalInput } from "@/components/terminal/TerminalInput";
import { TerminalModal } from "@/components/terminal/TerminalModal";
import { portfolioData } from "@/data/portfolio";
import {
  createSessionLogEntry,
  executeCommand,
  normalizeInput,
  parseCommand,
  resolveCommand,
} from "@/lib/commands/execute";
import { commandRegistry } from "@/lib/commands/registry";
import { getSuggestions } from "@/lib/commands/suggestions";
import {
  getCommandFromUrl,
  pushCommandToUrl,
  replaceCommandInUrl,
} from "@/lib/commands/url";
import { cn } from "@/lib/utils";
import type { ModalContent, SessionLogEntry, SuggestionItem } from "@/types/terminal";

type AppPhase = "locked" | "booting" | "ready" | "exiting";

interface AppState {
  phase: AppPhase;
  input: string;
  sessionLog: SessionLogEntry[];
  submittedHistory: string[];
  recallIndex: number;
  selectedSuggestionIndex: number;
  isMenuOpen: boolean;
  activeModal: ModalContent | null;
  bootLines: string[];
  startupError: string | null;
  exitDelayMs: number | null;
}

type AppAction =
  | { type: "set-input"; value: string; openMenu: boolean }
  | { type: "set-menu-open"; open: boolean }
  | { type: "set-selected-suggestion"; index: number }
  | { type: "append-log"; entry: SessionLogEntry; command: string; modal: ModalContent | null }
  | { type: "clear-session" }
  | { type: "set-recall"; value: string; index: number }
  | { type: "set-startup-error"; value: string | null }
  | { type: "start-boot" }
  | { type: "start-exit"; delayMs: number | null }
  | { type: "append-boot-line"; line: string }
  | { type: "finish-boot" }
  | { type: "close-modal" }
  | { type: "reset-to-locked" };

const BOOT_LINES = [
  "rohan",
  "Booting rohan shell...",
  "Initializing terminal environment",
  "Loading portfolio modules",
  "Syncing projects, experience, and contact",
  "Mounting interactive components",
  "Ready. Type / to explore!",
];


const LOCATIONS = ["Waterloo, ON", "Toronto, ON"];
const RECENT_ACTIVITY_LIMIT = 3;
const MENU_SCROLL_MARGIN = 24;

const initialState: AppState = {
  phase: "locked",
  input: "",
  sessionLog: [],
  submittedHistory: [],
  recallIndex: -1,
  selectedSuggestionIndex: 0,
  isMenuOpen: false,
  activeModal: null,
  bootLines: [],
  startupError: null,
  exitDelayMs: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "set-input":
      return {
        ...state,
        input: action.value,
        startupError: null,
        recallIndex: -1,
        isMenuOpen: action.openMenu,
        selectedSuggestionIndex: 0,
      };
    case "start-exit":
      return {
        ...state,
        phase: "exiting",
        input: "",
        isMenuOpen: false,
        selectedSuggestionIndex: 0,
        recallIndex: -1,
        exitDelayMs: action.delayMs,
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
    case "append-log":
      return {
        ...state,
        input: "",
        isMenuOpen: false,
        selectedSuggestionIndex: 0,
        recallIndex: -1,
        sessionLog: [...state.sessionLog, action.entry],
        submittedHistory: [...state.submittedHistory, action.command],
        activeModal: action.modal ?? state.activeModal,
      };
    case "clear-session":
      return {
        ...state,
        input: "",
        isMenuOpen: false,
        selectedSuggestionIndex: 0,
        recallIndex: -1,
        sessionLog: [],
        submittedHistory: [],
        activeModal: null,
        exitDelayMs: null,
      };
    case "set-recall":
      return {
        ...state,
        input: action.value,
        recallIndex: action.index,
        isMenuOpen: action.value.trimStart().startsWith("/"),
        selectedSuggestionIndex: 0,
      };
    case "set-startup-error":
      return {
        ...state,
        startupError: action.value,
      };
    case "start-boot":
      return {
        ...state,
        phase: "booting",
        input: "",
        isMenuOpen: false,
        selectedSuggestionIndex: 0,
        recallIndex: -1,
        startupError: null,
        bootLines: [],
        exitDelayMs: null,
      };
    case "append-boot-line":
      return {
        ...state,
        bootLines: [...state.bootLines, action.line],
      };
    case "finish-boot":
      return {
        ...state,
        phase: "ready",
        bootLines: [],
        input: "",
      };
    case "close-modal":
      return {
        ...state,
        activeModal: null,
      };
    case "reset-to-locked":
      return { ...initialState };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [locationIndex, setLocationIndex] = useState(0);
  const [typedLocation, setTypedLocation] = useState(LOCATIONS[0]);
  const [isDeletingLocation, setIsDeletingLocation] = useState(false);
  const deferredInput = useDeferredValue(state.input);
  const historyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const commandMenuRef = useRef<HTMLDivElement | null>(null);
  const hasHydratedRef = useRef(false);
  const bootTimeoutsRef = useRef<number[]>([]);
  const pendingCommandRef = useRef<string | null>(null);
  const menuWasOpenRef = useRef(false);
  const menuScrollRestoreRef = useRef<number | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);

  const suggestions =
    state.phase === "ready"
      ? getSuggestions(deferredInput, commandRegistry, portfolioData)
      : [];

  function canUseWindowScroll() {
    return typeof navigator === "undefined" || !/jsdom/i.test(navigator.userAgent);
  }

  function scrollWindow(top: number) {
    if (!canUseWindowScroll()) {
      return;
    }

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });
  }



  useEffect(() => {
    const target = LOCATIONS[locationIndex];

    const timeout = window.setTimeout(() => {
      if (!isDeletingLocation) {
        if (typedLocation.length < target.length) {
          setTypedLocation(target.slice(0, typedLocation.length + 1));
          return;
        }

        setIsDeletingLocation(true);
        return;
      }

      if (typedLocation.length > 0) {
        setTypedLocation(target.slice(0, typedLocation.length - 1));
        return;
      }

      setIsDeletingLocation(false);
      setLocationIndex((current) => (current + 1) % LOCATIONS.length);
    }, !isDeletingLocation ? (typedLocation.length === target.length ? 1100 : 65) : 35);

    return () => window.clearTimeout(timeout);
  }, [isDeletingLocation, locationIndex, typedLocation]);

  useEffect(() => {
    if (state.phase !== "booting") {
      inputRef.current?.focus();
    }
  }, [state.phase]);

  useEffect(() => {
    const wasOpen = menuWasOpenRef.current;

    if (state.isMenuOpen) {
      if (!wasOpen) {
        menuScrollRestoreRef.current = window.scrollY;
      }

      const raf = window.requestAnimationFrame(() => {
        const menuRect = commandMenuRef.current?.getBoundingClientRect();
        if (!menuRect) {
          return;
        }

        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const nextTop = window.scrollY + (menuRect.bottom - viewportHeight) + MENU_SCROLL_MARGIN;

        if (menuRect.bottom > viewportHeight - MENU_SCROLL_MARGIN) {
          scrollWindow(nextTop);
        }
      });

      menuWasOpenRef.current = true;
      return () => window.cancelAnimationFrame(raf);
    }

    if (!state.isMenuOpen && wasOpen) {
      const targetTop = menuScrollRestoreRef.current;
      const raf = window.requestAnimationFrame(() => {
        if (typeof targetTop === "number") {
          scrollWindow(targetTop);
        }
      });

      menuScrollRestoreRef.current = null;
      menuWasOpenRef.current = false;
      return () => window.cancelAnimationFrame(raf);
    }

    menuWasOpenRef.current = state.isMenuOpen;
  }, [state.isMenuOpen, suggestions.length]);

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
  }, [state.sessionLog]);

  useEffect(() => {
    if (suggestions.length === 0 && state.selectedSuggestionIndex !== 0) {
      dispatch({ type: "set-selected-suggestion", index: 0 });
    }

    if (suggestions.length && state.selectedSuggestionIndex > suggestions.length - 1) {
      dispatch({ type: "set-selected-suggestion", index: 0 });
    }
  }, [state.selectedSuggestionIndex, suggestions]);

  useEffect(() => {
    if (state.phase !== "booting") {
      return;
    }

    bootTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    bootTimeoutsRef.current = [];

    BOOT_LINES.forEach((line, index) => {
      const timeout = window.setTimeout(() => {
        dispatch({ type: "append-boot-line", line });
      }, 280 * (index + 1));

      bootTimeoutsRef.current.push(timeout);
    });

    const finishTimeout = window.setTimeout(() => {
      dispatch({ type: "finish-boot" });
      window.requestAnimationFrame(() => inputRef.current?.focus());

      const pendingCommand = pendingCommandRef.current;
      if (pendingCommand) {
        pendingCommandRef.current = null;
        runCommand(pendingCommand, { urlMode: "replace" });
      }
    }, 280 * BOOT_LINES.length + 300);

    bootTimeoutsRef.current.push(finishTimeout);

    return () => {
      bootTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      bootTimeoutsRef.current = [];
    };
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "exiting" || state.exitDelayMs === null) {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
      return;
    }

    exitTimeoutRef.current = window.setTimeout(() => {
      dispatch({ type: "reset-to-locked" });
      replaceCommandInUrl(null);
      exitTimeoutRef.current = null;
    }, state.exitDelayMs);

    return () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [state.exitDelayMs, state.phase]);

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

  function startBoot(pendingCommand: string | null = null) {
    pendingCommandRef.current = pendingCommand;
    dispatch({ type: "start-boot" });
  }

  function runCommand(
    rawInput: string,
    options: { urlMode?: "push" | "replace" | "none" } = {}
  ) {
    if (state.phase === "exiting") {
      return;
    }
    const { result } = executeCommand(rawInput);
    const normalized = normalizeInput(rawInput);

    if (result.meta?.clearHistory) {
      startTransition(() => {
        dispatch({ type: "clear-session" });
      });
      syncUrl(null, options.urlMode ?? "push");
      return;
    }

    const entry = createSessionLogEntry(normalized || rawInput.trim(), result);
    startTransition(() => {
      dispatch({
        type: "append-log",
        entry,
        command: normalized || rawInput.trim(),
        modal: result.modal,
      });
    });

    if (result.meta?.endSession) {
      startTransition(() => {
        dispatch({ type: "start-exit", delayMs: result.meta?.exitAfterMs ?? null });
      });
    }

    syncUrl(result.meta?.canonicalCommand ?? null, options.urlMode ?? "push");
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

  function closeModal() {
    if (state.phase === "exiting") {
      return;
    }
    dispatch({ type: "close-modal" });
    replaceCommandInUrl(null);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  useEffect(() => {
    if (hasHydratedRef.current) {
      return;
    }

    hasHydratedRef.current = true;

    const command = getCommandFromUrl();
    if (command) {
      dispatch({ type: "finish-boot" });
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
        runCommand(command, { urlMode: "replace" });
      });
      return;
    }
  }, []);

  useEffect(() => {
    function handlePopState() {
      if (state.phase === "exiting") {
        return;
      }
      const command = getCommandFromUrl();

      if (!command) {
        dispatch({ type: "close-modal" });
        return;
      }

      if (state.phase === "locked" || state.phase === "booting") {
        startBoot(command);
        return;
      }

      runCommand(command, { urlMode: "none" });
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [state.phase]);

  const recentActivity = state.sessionLog.slice(-RECENT_ACTIVITY_LIMIT).reverse();
  const currentLocation = typedLocation || "\u00a0";
  const isIdleShell = state.sessionLog.length === 0;


  if (state.phase === "locked") {
    return (
      <motion.div
        className="app-shell startup-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="startup-shell-inner">
          <TerminalInput
            value={state.input}
            inputRef={inputRef}
            mode="startup"
            placeholder="Type rohan to start"
            onChange={(value) =>
              dispatch({
                type: "set-input",
                value,
                openMenu: false,
              })
            }
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }

              event.preventDefault();

              if (normalizeInput(state.input).toLowerCase() === "rohan") {
                startBoot();
                return;
              }

              if (state.input.trim()) {
                dispatch({ type: "set-input", value: "", openMenu: false });
                dispatch({
                  type: "set-startup-error",
                  value: "Unknown input. Type rohan to start.",
                });
              }
            }}
          />

          {state.startupError ? <p className="startup-error">{state.startupError}</p> : null}
        </div>
      </motion.div>
    );
  }

  if (state.phase === "booting") {
    return (
      <motion.div
        className="app-shell startup-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="boot-sequence" aria-live="polite">
          {state.bootLines.map((line, index) => (
            <motion.p
              key={`${line}-${index}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="boot-line"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="app-shell">
      <motion.div
        className="app-frame"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <section className={cn("terminal-panel", isIdleShell && "is-idle")}>
          <div
            ref={historyRef}
            className={cn("terminal-history", isIdleShell && "is-idle")}
          >
            <TerminalDashboard
              recentActivity={recentActivity}
              onRunCommand={runCommand}
              currentLocation={currentLocation}
            />
            <TerminalHistory history={state.sessionLog} />
          </div>

          <div className="terminal-input-area">
            <TerminalInput
              value={state.input}
              inputRef={inputRef}
              placeholder="Type / to explore commands"
              onChange={(value) =>
                dispatch({
                  type: "set-input",
                  value,
                  openMenu: value.trimStart().startsWith("/"),
                })
              }
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && state.isMenuOpen && state.recallIndex === -1) {
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

                if (event.key === "ArrowUp" && state.isMenuOpen && state.recallIndex === -1) {
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
                    const normalized = normalizeInput(state.input);
                    const parsed = parseCommand(state.input);
                    const exactSuggestion = suggestions.find(
                      (item) => item.value.toLowerCase() === normalized.toLowerCase()
                    );
                    const exactCommand =
                      parsed && !parsed.argText && !state.input.trimStart().endsWith(" ")
                        ? resolveCommand(parsed)
                        : null;

                    if (exactSuggestion || exactCommand) {
                      runCommand(state.input);
                      return;
                    }

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

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  recallCommand("down");
                }
              }}
            />
          </div>
        </section>

        <AnimatePresence>
          {state.isMenuOpen ? (
            <CommandMenu
              menuRef={commandMenuRef}
              suggestions={suggestions}
              selectedIndex={state.selectedSuggestionIndex}
              onSelect={(item) => applySuggestion(item, item.submitOnSelect ?? false)}
            />
          ) : null}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {state.activeModal ? (
          <TerminalModal
            content={state.activeModal}
            onClose={closeModal}
            onRunCommand={runCommand}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
