import { forwardRef, useState, type ReactNode } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  label: string;
  labelAction?: ReactNode;
}

const EyeIcon = ({ visible }: { visible: boolean }) =>
  visible ? (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M2 10s2.75-5.5 8-5.5 8 5.5 8 5.5-2.75 5.5-8 5.5-8-5.5-8-5.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M2.5 2.5l15 15M8.35 8.4a2 2 0 002.77 2.77M6.1 6.13C3.6 7.44 2 10 2 10s2.75 5.5 8 5.5c1.44 0 2.68-.42 3.7-1.02M11.9 5.04A7.7 7.7 0 0010 4.5c-.5 0-.98.04-1.44.12M18 10s-.86 1.72-2.5 3.14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, errorMessage, labelAction, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div>
        {labelAction ? (
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-ink">
              {label}
            </label>
            {labelAction}
          </div>
        ) : (
          <label className="block text-sm font-medium text-ink">{label}</label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            aria-invalid={!!errorMessage}
            className={`mt-1.5 w-full rounded-lg border border-transparent bg-ink/5 px-3 py-2.5 text-sm text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 ease-out focus:border-terracotta focus:bg-white focus:ring-4 focus:ring-terracotta-light aria-invalid:border-red-400 aria-invalid:focus:ring-red-500/10 ${
              isPassword ? "pr-10" : ""
            }`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-clay transition-colors duration-150 ease-out hover:text-ink"
            >
              <EyeIcon visible={showPassword} />
            </button>
          )}
        </div>
        <p
          className={`grid text-xs text-red-600 transition-[grid-template-rows,opacity,margin-top] duration-150 ease-out ${
            errorMessage
              ? "grid-rows-[1fr] opacity-100 mt-1"
              : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          <span className="overflow-hidden">{errorMessage}</span>
        </p>
      </div>
    );
  },
);

export default FormInput;
