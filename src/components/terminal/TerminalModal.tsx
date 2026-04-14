import { useEffect } from "react";
import { motion } from "framer-motion";
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
      onMouseDown={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={content.title}
        className="modal-panel"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.18 }}
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
          <OutputRenderer content={content} onRunCommand={onRunCommand} />
        </div>
      </motion.div>
    </motion.div>
  );
}
