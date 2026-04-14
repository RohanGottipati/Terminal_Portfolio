import type { KeyboardEvent, MutableRefObject } from "react";

interface TerminalInputProps {
  value: string;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function TerminalInput({
  value,
  inputRef,
  onChange,
  onKeyDown,
}: TerminalInputProps) {
  return (
    <div className="terminal-input-shell">
      <div className="terminal-prompt">
        <span className="text-emerald-400">visitor</span>
        <span className="text-zinc-500">@</span>
        <span className="text-cyan-300">rohan</span>
        <span className="text-zinc-500">:~$</span>
      </div>

      <input
        ref={inputRef}
        className="terminal-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type / to explore commands"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="Portfolio command input"
      />
    </div>
  );
}
