import { forwardRef } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <input
          ref={ref}
          className={`w-full h-11 px-3 rounded-lg border border-border bg-card text-foreground text-sm
            placeholder:text-muted-foreground
            focus:outline-none focus:border-primary focus:input-focus-ring
            transition-all duration-200 ${error ? "border-destructive" : ""} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
