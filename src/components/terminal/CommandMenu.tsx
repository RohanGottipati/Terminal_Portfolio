import type { RefObject } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SuggestionItem } from "@/types/terminal";

interface CommandMenuProps {
  suggestions: SuggestionItem[];
  selectedIndex: number;
  onSelect: (item: SuggestionItem) => void;
  menuRef?: RefObject<HTMLDivElement | null>;
}

export function CommandMenu({
  suggestions,
  selectedIndex,
  onSelect,
  menuRef,
}: CommandMenuProps) {
  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="command-menu"
    >
      {suggestions.length ? (
        suggestions.map((item, index) => (
          <Button
            key={item.id}
            type="button"
            variant="commandMenu"
            size="none"
            className={cn("command-menu-item", index === selectedIndex && "is-selected")}
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(item);
            }}
          >
            <span className="command-menu-label">{item.label}</span>
            <span className="command-menu-description">{item.description}</span>
          </Button>
        ))
      ) : (
        <div className="command-menu-empty">
          <p className="command-menu-label">No matches</p>
          <p className="command-menu-description">
            Try a different prefix or run <code>/help</code>.
          </p>
        </div>
      )}
    </motion.div>
  );
}
