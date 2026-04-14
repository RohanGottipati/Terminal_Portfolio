import { OutputRenderer } from "@/components/terminal/OutputRenderer";
import type { HistoryEntry } from "@/types/terminal";

interface TerminalHistoryProps {
  history: HistoryEntry[];
  onRunCommand: (command: string) => void;
}

function formatTimestamp(value: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function TerminalHistory({
  history,
  onRunCommand,
}: TerminalHistoryProps) {
  return (
    <div className="space-y-6">
      {history.map((entry) => (
        <article key={entry.id} className="space-y-3">
          {entry.input ? (
            <div className="command-line">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="text-emerald-400">visitor</span>
                <span>@</span>
                <span className="text-cyan-300">rohan</span>
                <span className="text-zinc-500">~</span>
                <span className="text-zinc-700">·</span>
                <span>{formatTimestamp(entry.createdAt)}</span>
              </div>
              <p className="text-base text-white">{entry.input}</p>
            </div>
          ) : null}

          <OutputRenderer entry={entry} onRunCommand={onRunCommand} />
        </article>
      ))}
    </div>
  );
}
