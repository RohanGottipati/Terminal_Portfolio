import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { OutputRenderer } from "@/components/terminal/OutputRenderer";
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
      const panel = panelRef.current;
      if (!panel) return [];
      return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    }

    function focusByDelta(delta: number) {
      const items = getFocusableItems();
      if (!items.length) return;

      const currentIndex = Math.max(0, items.indexOf(document.activeElement as HTMLElement));
      const nextIndex = Math.min(items.length - 1, Math.max(0, currentIndex + delta));
      const next = items[nextIndex];
      if (!next) return;

      next.focus({ preventScroll: true });
      next.scrollIntoView({ block: "nearest", behavior: "smooth" });
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

  // Keep focus on the close control so content rows are not pre-highlighted.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [content.title]);

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
            <button
              ref={closeButtonRef}
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
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
