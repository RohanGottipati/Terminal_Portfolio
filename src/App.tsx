import {
  startTransition,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Github, Linkedin, Mail } from "lucide-react";

import { CommandMenu } from "@/components/terminal/CommandMenu";
import { TerminalDashboard } from "@/components/terminal/TerminalDashboard";
import { TerminalHistory } from "@/components/terminal/TerminalHistory";
import { TerminalInput } from "@/components/terminal/TerminalInput";
import { TerminalModal } from "@/components/terminal/TerminalModal";
import { Button } from "@/components/ui/button";
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
  modalBackCommand: string | null;
  bootLines: string[];
  startupError: string | null;
  exitDelayMs: number | null;
}

type AppAction =
  | { type: "set-input"; value: string; openMenu: boolean }
  | { type: "set-menu-open"; open: boolean }
  | { type: "set-selected-suggestion"; index: number }
  | { type: "append-log"; entry: SessionLogEntry; command: string; modal: ModalContent | null; backCommand: string | null }
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
  "rohan@portfolio:~$ rohan",
  "  initializing ~/portfolio/rohan-shell",
  "  loading portfolio data",
  "  mounting projects, experience, skills",
  "  resolving contact + links",
  "  starting interactive shell",
  "  ready — type / to explore",
];

const WINDOW_ACTIONS = [
  {
    label: "Email Rohan",
    tooltip: "Email",
    href: `mailto:${portfolioData.contact.email}`,
    Icon: Mail,
    openInNewTab: false,
  },
  {
    label: "View GitHub profile",
    tooltip: "GitHub",
    href: portfolioData.contact.github,
    Icon: Github,
    openInNewTab: true,
  },
  {
    label: "View LinkedIn profile",
    tooltip: "LinkedIn",
    href: portfolioData.contact.linkedin,
    Icon: Linkedin,
    openInNewTab: true,
  },
  {
    label: "Open resume PDF",
    tooltip: "Resume",
    href: portfolioData.contact.resume,
    Icon: FileText,
    openInNewTab: true,
  },
] as const;


const LOCATIONS = ["Waterloo, ON", "Toronto, ON"];
const MENU_SCROLL_MARGIN = 24;
const FOCUSABLE = "button:not([disabled]), a[href], [tabindex='0']";

const initialState: AppState = {
  phase: "locked",
  input: "",
  sessionLog: [],
  submittedHistory: [],
  recallIndex: -1,
  selectedSuggestionIndex: -1,
  isMenuOpen: false,
  activeModal: null,
  modalBackCommand: null,
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
        selectedSuggestionIndex: action.openMenu ? -1 : state.selectedSuggestionIndex,
      };
    case "start-exit":
      return {
        ...state,
        phase: "exiting",
        input: "",
        isMenuOpen: false,
        selectedSuggestionIndex: -1,
        recallIndex: -1,
        exitDelayMs: action.delayMs,
      };
    case "set-menu-open":
      return {
        ...state,
        isMenuOpen: action.open,
        selectedSuggestionIndex: action.open ? state.selectedSuggestionIndex : -1,
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
        selectedSuggestionIndex: -1,
        recallIndex: -1,
        sessionLog: [...state.sessionLog, action.entry],
        submittedHistory: [...state.submittedHistory, action.command],
        activeModal: action.modal ?? state.activeModal,
        modalBackCommand: action.modal !== null ? action.backCommand : state.modalBackCommand,
      };
    case "clear-session":
      return {
        ...state,
        input: "",
        isMenuOpen: false,
        selectedSuggestionIndex: -1,
        recallIndex: -1,
        sessionLog: [],
        submittedHistory: [],
        activeModal: null,
        modalBackCommand: null,
        exitDelayMs: null,
      };
    case "set-recall":
      return {
        ...state,
        input: action.value,
        recallIndex: action.index,
        isMenuOpen: false,
        selectedSuggestionIndex: -1,
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
        selectedSuggestionIndex: -1,
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
        modalBackCommand: null,
      };
    case "reset-to-locked":
      return { ...initialState };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [locationIndex, setLocationIndex] = useState(0);
  const [typedLocation, setTypedLocation] = useState(LOCATIONS[0]);
  const [isDeletingLocation, setIsDeletingLocation] = useState(false);
  const deferredInput = useDeferredValue(state.input);
  const historyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const commandMenuRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const hasHydratedRef = useRef(false);
  const bootTimeoutsRef = useRef<number[]>([]);
  const pendingCommandRef = useRef<string | null>(null);
  const menuWasOpenRef = useRef(false);
  const menuScrollRestoreRef = useRef<number | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);
  const panelFocusTimeoutRef = useRef<number | null>(null);
  const panelFocusIndexRef = useRef(-1);
  const modalRestoreFocusTimeoutRef = useRef<number | null>(null);

  const suggestions =
    state.phase === "ready"
      ? getSuggestions(deferredInput, commandRegistry, portfolioData)
      : [];
  const hasBlockingModal = Boolean(state.activeModal) || isModalClosing;

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

  function focusElement(element: HTMLElement | null) {
    if (!element) {
      return;
    }

    try {
      element.focus({ preventScroll: true });
    } catch {
      element.focus();
    }
  }

  function queuePanelFocus(direction: "up" | "down") {
    if (panelFocusTimeoutRef.current !== null) {
      window.clearTimeout(panelFocusTimeoutRef.current);
    }

    panelFocusTimeoutRef.current = window.setTimeout(() => {
      panelFocusTimeoutRef.current = null;
      focusPanelItem(direction);
    }, 0);
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
    return () => {
      if (panelFocusTimeoutRef.current !== null) {
        window.clearTimeout(panelFocusTimeoutRef.current);
      }
      if (modalRestoreFocusTimeoutRef.current !== null) {
        window.clearTimeout(modalRestoreFocusTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    function handleFocusIn(event: FocusEvent) {
      const target = event.target as HTMLElement | null;
      if (!target || target.classList.contains("terminal-input")) {
        return;
      }

      if (modalRestoreFocusTimeoutRef.current !== null) {
        window.clearTimeout(modalRestoreFocusTimeoutRef.current);
        modalRestoreFocusTimeoutRef.current = null;
      }

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => !element.classList.contains("terminal-input")
      );
      const nextIndex = items.indexOf(target);
      if (nextIndex !== -1) {
        panelFocusIndexRef.current = nextIndex;
      }
    }

    panel.addEventListener("focusin", handleFocusIn);
    return () => panel.removeEventListener("focusin", handleFocusIn);
  }, [state.phase]);

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
    if (suggestions.length === 0 && state.selectedSuggestionIndex !== -1) {
      dispatch({ type: "set-selected-suggestion", index: -1 });
    }

    if (suggestions.length && state.selectedSuggestionIndex > suggestions.length - 1) {
      dispatch({ type: "set-selected-suggestion", index: -1 });
    }
  }, [state.selectedSuggestionIndex, suggestions]);

  useEffect(() => {
    if (state.phase !== "booting") {
      return;
    }

    bootTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    bootTimeoutsRef.current = [];

    BOOT_LINES.forEach((line, index) => {
      const delay = index === 0 ? 120 : 120 + index * 160;
      const timeout = window.setTimeout(() => {
        dispatch({ type: "append-boot-line", line });
      }, delay);

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
    }, 120 + (BOOT_LINES.length - 1) * 160 + 280);

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
      window.close();
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

    const backCommand =
      result.modal?.type === "projectDetail" && state.activeModal?.type === "projectList"
        ? "/projects"
        : null;

    const entry = createSessionLogEntry(normalized || rawInput.trim(), result);
    startTransition(() => {
      dispatch({
        type: "append-log",
        entry,
        command: normalized || rawInput.trim(),
        modal: result.modal,
        backCommand,
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
    if (state.modalBackCommand) {
      runCommand(state.modalBackCommand, { urlMode: "replace" });
      return;
    }
    setIsModalClosing(true);
    dispatch({ type: "close-modal" });
    replaceCommandInUrl(null);
  }

  function focusPanelItem(direction: "up" | "down") {
    const panel = panelRef.current;
    if (!panel) return false;

    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.classList.contains("terminal-input")
    );
    if (!items.length) return false;

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? items.indexOf(active) : -1;
    const rememberedIndex =
      active === document.body || active === document.documentElement
        ? panelFocusIndexRef.current
        : -1;
    const baseIndex = currentIndex === -1 ? rememberedIndex : currentIndex;

    const nextIndex =
      direction === "down"
        ? Math.min(items.length - 1, baseIndex === -1 ? 0 : baseIndex + 1)
        : Math.max(0, baseIndex === -1 ? items.length - 1 : baseIndex - 1);

    const next = items[nextIndex];
    if (!next) return false;

    panelFocusIndexRef.current = nextIndex;
    focusElement(next);
    if (typeof next.scrollIntoView === "function") {
      next.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    return true;
  }

  useLayoutEffect(() => {
    if (state.phase !== "ready" || hasBlockingModal || state.isMenuOpen) {
      return;
    }

    function handlePanelArrowNavigation(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
        return;
      }

      const target = event.target as HTMLElement | null;
      const isDocumentSurface =
        target === document.body || target === document.documentElement;

      if (!isDocumentSurface) {
        return;
      }

      event.preventDefault();
      queuePanelFocus(event.key === "ArrowDown" ? "down" : "up");
    }

    window.addEventListener("keydown", handlePanelArrowNavigation);
    return () => window.removeEventListener("keydown", handlePanelArrowNavigation);
  }, [hasBlockingModal, state.isMenuOpen, state.phase]);

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
        closeModal();
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
  }, [state.phase, state.modalBackCommand]);

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
            placeholder="Type rohan, then press Enter"
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
                  value: "Unknown input. Type rohan, then press Enter.",
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
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
        <section
          ref={panelRef}
          className={cn("terminal-panel", isIdleShell && "is-idle")}
          onKeyDownCapture={(event) => {
            if (
              state.phase !== "ready" ||
              hasBlockingModal ||
              state.isMenuOpen ||
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              (event.key !== "ArrowUp" && event.key !== "ArrowDown")
            ) {
              return;
            }

            const target = event.target as HTMLElement | null;
            if (!target || target.classList.contains("terminal-input")) {
              return;
            }

            if (!panelRef.current?.contains(target)) {
              return;
            }

            event.preventDefault();
            queuePanelFocus(event.key === "ArrowDown" ? "down" : "up");
          }}
        >
          <div className="terminal-window-chrome" role="group" aria-label="Terminal window">
            <div className="terminal-window-dots" aria-hidden="true">
              <span className="terminal-window-dot terminal-window-dot-close" />
              <span className="terminal-window-dot terminal-window-dot-minimize" />
              <span className="terminal-window-dot terminal-window-dot-zoom" />
            </div>
            <span className="terminal-window-title">rohan shell v1.3.2</span>
            <div className="terminal-window-actions" aria-label="Contact shortcuts">
              {WINDOW_ACTIONS.map(({ label, tooltip, href, Icon, openInNewTab }) => (
                <Button
                  key={label}
                  variant="terminalIcon"
                  size="icon"
                  asChild
                  className="terminal-window-action"
                >
                  <a
                    href={href}
                    aria-label={label}
                    tabIndex={0}
                    {...(openInNewTab ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span className="terminal-window-action-label" aria-hidden="true">
                      {tooltip}
                    </span>
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div
            ref={historyRef}
            className={cn("terminal-history", isIdleShell && "is-idle")}
          >
            <TerminalDashboard
              onRunCommand={runCommand}
              currentLocation={currentLocation}
            />
            <TerminalHistory history={state.sessionLog} />
          </div>

          <div className="terminal-input-area">
            <TerminalInput
              value={state.input}
              inputRef={inputRef}
              disabled={state.phase === "exiting"}
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
                        ? -1
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
                        ? -1
                        : state.selectedSuggestionIndex === -1
                          ? suggestions.length - 1
                          : (state.selectedSuggestionIndex - 1 + suggestions.length) %
                            suggestions.length,
                  });
                  return;
                }

                if (event.key === "Tab" && state.isMenuOpen && suggestions.length) {
                  event.preventDefault();
                  const selectedSuggestion =
                    state.selectedSuggestionIndex === -1
                      ? suggestions[0]
                      : suggestions[state.selectedSuggestionIndex];
                  applySuggestion(selectedSuggestion, false);
                  return;
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  if (state.activeModal) {
                    closeModal();
                    return;
                  }

                  if (state.isMenuOpen) {
                    dispatch({ type: "set-menu-open", open: false });
                    return;
                  }

                  window.requestAnimationFrame(() => inputRef.current?.focus());
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

                    const selectedSuggestion =
                      state.selectedSuggestionIndex === -1
                        ? suggestions[0]
                        : suggestions[state.selectedSuggestionIndex];
                    applySuggestion(selectedSuggestion, true);
                    return;
                  }

                  if (state.input.trim()) {
                    runCommand(state.input);
                  }

                  return;
                }

                if (event.key === "ArrowUp") {
                  if (!state.isMenuOpen && !state.activeModal && state.submittedHistory.length) {
                    event.preventDefault();
                    recallCommand("up");
                    return;
                  }

                  if (!state.isMenuOpen && !state.activeModal && state.input.length === 0) {
                    event.preventDefault();
                    inputRef.current?.blur();
                    queuePanelFocus("up");
                    return;
                  }
                }

                if (event.key === "ArrowDown") {
                  if (!state.isMenuOpen && !state.activeModal && state.recallIndex !== -1) {
                    event.preventDefault();
                    recallCommand("down");
                    return;
                  }

                  if (!state.isMenuOpen && !state.activeModal && state.input.length === 0) {
                    event.preventDefault();
                    inputRef.current?.blur();
                    queuePanelFocus("down");
                    return;
                  }
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

      <AnimatePresence
        onExitComplete={() => {
          setIsModalClosing(false);
          if (modalRestoreFocusTimeoutRef.current !== null) {
            window.clearTimeout(modalRestoreFocusTimeoutRef.current);
          }

          modalRestoreFocusTimeoutRef.current = window.setTimeout(() => {
            modalRestoreFocusTimeoutRef.current = null;
            const activeElement = document.activeElement as HTMLElement | null;
            const panel = panelRef.current;
            const isShellControlFocused =
              !!activeElement &&
              !!panel &&
              panel.contains(activeElement) &&
              !activeElement.classList.contains("terminal-input");

            if (!isShellControlFocused) {
              inputRef.current?.focus();
            }
          }, 0);
        }}
      >
        {state.activeModal ? (
          <TerminalModal
            content={state.activeModal}
            dismissible={state.phase !== "exiting"}
            onClose={closeModal}
            onRunCommand={runCommand}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
