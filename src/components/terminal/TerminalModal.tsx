import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { OutputRenderer } from "@/components/terminal/OutputRenderer";
import { Button } from "@/components/ui/button";
import type { ModalContent } from "@/types/terminal";

const FOCUSABLE = "button:not([disabled]), a[href], [tabindex='0']";

interface TerminalModalProps {
  content: ModalContent;
  onClose: () => void;
  onRunCommand: (command: string) => void;
}

export function TerminalModal({
  content,
  onClose,
  onRunCommand,
}: TerminalModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function getFocusableItems() {
      const body = bodyRef.current;
      if (!body) return [];
      return Array.from(body.querySelectorAll<HTMLElement>(FOCUSABLE));
    }

    function focusElement(element: HTMLElement | null) {
      if (!element) return;

      try {
        element.focus({ preventScroll: true });
      } catch {
        element.focus();
      }
    }

    function focusByDelta(delta: number) {
      const items = getFocusableItems();
      if (!items.length) {
        focusElement(closeButtonRef.current);
        return;
      }

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      const nextIndex =
        currentIndex === -1
          ? delta > 0
            ? 0
            : items.length - 1
          : (currentIndex + delta + items.length) % items.length;
      const next = items[nextIndex];
      if (!next) return;

      focusElement(next);
      if (typeof next.scrollIntoView === "function") {
        next.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusByDelta(1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusByDelta(-1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const firstFocusableItem = bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      if (firstFocusableItem) {
        try {
          firstFocusableItem.focus({ preventScroll: true });
        } catch {
          firstFocusableItem.focus();
        }
        return;
      }

      try {
        closeButtonRef.current?.focus({ preventScroll: true });
      } catch {
        closeButtonRef.current?.focus();
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [content.title, content.type]);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseDown={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={content.title}
        className="modal-panel"
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.99 }}
        transition={{ type: "spring", damping: 28, stiffness: 340, mass: 0.75 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div className="modal-title-block">
            <p className="modal-kicker">
              ~/portfolio/rohan-shell{content.path ? `/${content.path}` : ""}
            </p>
          </div>
          <div className="modal-header-controls">
            <span className="modal-shortcut-hint" aria-label="Press Escape to close">
              Esc
            </span>
            <Button
              ref={closeButtonRef}
              type="button"
              variant="terminalIcon"
              size="icon"
              className="modal-close"
              onClick={onClose}
              aria-label="Close panel"
            >
              <X size={16} />
            </Button>
          </div>
        </header>

        <div className="modal-body" ref={bodyRef}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={content.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <OutputRenderer content={content} onRunCommand={onRunCommand} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
