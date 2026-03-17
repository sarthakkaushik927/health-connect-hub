import { Loader2 } from "lucide-react";

interface SpinnerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

const SpinnerButton = ({ loading, children, className = "", ...props }: SpinnerButtonProps) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full h-12 rounded-lg bg-primary text-primary-foreground font-medium text-sm
        hover:brightness-110 active:scale-[0.98] transition-all duration-150
        disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};

export default SpinnerButton;
