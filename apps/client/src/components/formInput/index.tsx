import { forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  label: string;
}

const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, errorMessage, ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-ink">{label}</label>
        <input
          ref={ref}
          aria-invalid={!!errorMessage}
          className="mt-1.5 w-full rounded-lg border border-transparent bg-ink/5 px-3 py-2.5 text-sm text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 ease-out focus:border-terracotta focus:bg-white focus:ring-4 focus:ring-terracotta-light aria-invalid:border-red-400 aria-invalid:focus:ring-red-500/10"
          {...props}
        />
        <p
          className={`grid text-sm text-red-600 transition-[grid-template-rows,opacity,margin-top] duration-150 ease-out ${
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
