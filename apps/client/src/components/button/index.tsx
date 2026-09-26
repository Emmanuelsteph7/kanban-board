import type { ReactNode } from "react";

type Variant = "primary" | "dark" | "outline" | "ghost" | "danger-ghost";
type Size = "sm" | "md";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-terracotta text-paper hover:bg-ink",
  dark: "bg-ink text-paper hover:bg-terracotta",
  outline:
    "border border-dashed border-clay/40 bg-transparent text-clay hover:border-clay/70 hover:text-ink",
  ghost: "bg-transparent text-clay hover:bg-ink/5 hover:text-ink",
  "danger-ghost": "bg-transparent text-terracotta hover:bg-terracotta/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 gap-1.5 px-4 text-sm",
  md: "gap-2 py-2.5 text-sm",
};

const Button = ({
  label,
  icon,
  isLoading,
  loadingText = "Loading...",
  variant = "primary",
  size = "md",
  fullWidth = true,
  type = "submit",
  className = "",
  children,
  ...props
}: Props) => {
  return (
    <button
      type={type}
      disabled={isLoading || props.disabled}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-[background-color,transform,border-color,color] duration-150 ease-out active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />
          {loadingText}
        </span>
      ) : (
        <>
          {icon}
          {label ?? children}
        </>
      )}
    </button>
  );
};

export default Button;
