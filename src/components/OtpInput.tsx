import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: boolean;
  success?: boolean;
}

const OtpInput = ({ length = 6, onComplete, error, success }: OtpInputProps) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newValues = [...values];
    newValues[index] = value.slice(-1);
    setValues(newValues);

    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    const otp = newValues.join("");
    if (otp.length === length && newValues.every((v) => v !== "")) {
      onComplete(otp);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const newValues = [...values];
    paste.split("").forEach((char, i) => {
      newValues[i] = char;
    });
    setValues(newValues);
    if (paste.length === length) {
      onComplete(paste);
    } else {
      inputs.current[paste.length]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-12 h-14 text-center text-xl font-semibold tabular-nums
            border-b-2 bg-transparent outline-none transition-colors duration-200
            ${success ? "border-primary animate-pulse-border" : ""}
            ${error ? "border-destructive" : ""}
            ${!success && !error ? "border-border focus:border-primary" : ""}
          `}
        />
      ))}
    </div>
  );
};

export default OtpInput;
