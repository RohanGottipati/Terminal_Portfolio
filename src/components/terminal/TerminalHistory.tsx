import { cn } from "@/lib/utils";
import type { SessionLogEntry } from "@/types/terminal";

interface TerminalHistoryProps {
  history: SessionLogEntry[];
}

function formatTimestamp(value: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function TerminalHistory({ history }: TerminalHistoryProps) {
  if (!history.length) {
    return (
      <div className="terminal-empty-state">
        <p>Run a command to open a panel.</p>
      </div>
    );
  }

  return (
    <div className="terminal-log">
      {history.map((entry) => (
        <article key={entry.id} className="terminal-log-entry">
          <div className="terminal-log-command">
            <span className="terminal-log-timestamp">{formatTimestamp(entry.createdAt)}</span>
            <span className="terminal-log-glyph">&gt;</span>
            <span className="terminal-log-input">{entry.input}</span>
          </div>
          <p
            className={cn(
              "terminal-log-summary",
              entry.status === "error" && "is-error",
              entry.status === "info" && "is-info"
            )}
          >
            {entry.summary}
          </p>
        </article>
      ))}
    </div>
  );
}
