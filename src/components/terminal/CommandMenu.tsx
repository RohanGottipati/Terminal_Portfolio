import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { SuggestionItem } from "@/types/terminal";

interface CommandMenuProps {
  suggestions: SuggestionItem[];
  selectedIndex: number;
  onSelect: (item: SuggestionItem) => void;
}

export function CommandMenu({
  suggestions,
  selectedIndex,
  onSelect,
}: CommandMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="command-menu"
    >
      {suggestions.length ? (
        suggestions.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={cn("command-menu-item", index === selectedIndex && "is-selected")}
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(item);
            }}
          >
            <div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-sm text-zinc-400">{item.description}</p>
            </div>
            <span className="command-menu-category">{item.category}</span>
          </button>
        ))
      ) : (
        <div className="command-menu-empty">
          <p className="text-sm font-medium text-white">No matches</p>
          <p className="text-sm text-zinc-400">
            Try a different prefix or run <code>/help</code>.
          </p>
        </div>
      )}
    </motion.div>
  );
}
