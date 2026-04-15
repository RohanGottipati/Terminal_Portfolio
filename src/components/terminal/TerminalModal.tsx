import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { OutputRenderer } from "@/components/terminal/OutputRenderer";
import type { ModalContent } from "@/types/terminal";

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
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
            <p className="modal-kicker">rohan shell</p>
            <h2 className="modal-title">{content.title}</h2>
            {content.description ? (
              <p className="modal-description">{content.description}</p>
            ) : null}
          </div>
          <div className="modal-header-controls">
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        <div className="modal-body">
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
