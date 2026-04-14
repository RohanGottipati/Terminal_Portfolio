import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
} from "react";

interface TerminalInputProps {
  value: string;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  mode?: "startup" | "command";
}

export function TerminalInput({
  value,
  inputRef,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  mode = "command",
}: TerminalInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [caretIndex, setCaretIndex] = useState(value.length);
  const [cursorOffset, setCursorOffset] = useState(0);
  const measureRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    setCaretIndex((current) => Math.min(current, value.length));
  }, [value]);

  useLayoutEffect(() => {
    setCursorOffset(measureRef.current?.offsetWidth ?? 0);
  }, [caretIndex, value]);

  function syncCaret() {
    const nextCaretIndex = inputRef.current?.selectionStart ?? value.length;
    setCaretIndex(nextCaretIndex);
  }

  const measuredText = value.slice(0, caretIndex).replace(/ /g, "\u00a0") || "\u200b";
  const showCursor = !disabled && isFocused;
  const showPlaceholder = !value.length;

  return (
    <div className="terminal-input-shell">
      <div className="terminal-prompt" aria-hidden="true">
        <span className={mode === "startup" ? "terminal-prompt-startup" : "terminal-prompt-ready"}>
          &gt;
        </span>
      </div>

      <div className="terminal-input-track">
        <span ref={measureRef} className="terminal-input-measure">
          {measuredText}
        </span>

        {showPlaceholder ? (
          <span className="terminal-input-placeholder">{placeholder}</span>
        ) : null}

        <input
          ref={inputRef}
          className="terminal-input"
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            onChange(event.target.value);
            setCaretIndex(event.target.selectionStart ?? event.target.value.length);
          }}
          onKeyDown={onKeyDown}
          onKeyUp={syncCaret}
          onClick={syncCaret}
          onSelect={syncCaret}
          onFocus={() => {
            setIsFocused(true);
            syncCaret();
          }}
          onBlur={() => setIsFocused(false)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          disabled={disabled}
          aria-label={mode === "startup" ? "Startup input" : "Portfolio command input"}
        />

        {showCursor ? (
          <span
            className="terminal-block-cursor"
            style={{ transform: `translate(${cursorOffset}px, -50%)` }}
          />
        ) : null}
      </div>
    </div>
  );
}
