import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";
import type { ReactNode } from "react";

type Variant = "success" | "error" | "info";

interface ToastOptions {
  description?: string;
}

const icons: Record<Variant, ReactNode> = {
  success: (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M4 10.5l3.5 3.5L16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M6 6l8 8M14 6l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M10 9v5M10 6.5v.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

const iconColors: Record<Variant, string> = {
  success: "bg-terracotta/10 text-terracotta",
  error: "bg-red-500/10 text-red-600",
  info: "bg-ink/10 text-ink",
};

function ToastCard({
  id,
  title,
  description,
  variant = "info",
}: {
  id: string | number;
  title: string;
  description?: string;
  variant?: Variant;
}) {
  return (
    <div className="starting:opacity-0 starting:translate-y-1 starting:scale-95 flex w-[356px] items-start gap-3 rounded-xl border border-ink/10 bg-white p-4 shadow-[0_8px_24px_-8px_rgba(28,26,23,0.18)] transition-[opacity,transform] duration-200 ease-out">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconColors[variant]}`}
      >
        {icons[variant]}
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium leading-tight text-ink">{title}</p>
        {description && (
          <p className="mt-1 text-sm leading-snug text-clay">{description}</p>
        )}
      </div>

      <button
        onClick={() => sonnerToast.dismiss(id)}
        aria-label="Dismiss"
        className="shrink-0 rounded-md p-1 text-clay transition-colors duration-150 ease-out hover:bg-ink/5 hover:text-ink"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

const create =
  (variant: Variant) => (title: string, options?: ToastOptions) =>
    sonnerToast.custom(
      (id) => (
        <ToastCard
          id={id}
          title={title}
          description={options?.description}
          variant={variant}
        />
      ),
      { unstyled: true },
    );

export const toast = Object.assign(create("info"), {
  success: create("success"),
  error: create("error"),
  info: create("info"),
  dismiss: sonnerToast.dismiss,
});

export const Toaster = () => (
  <SonnerToaster
    position="top-right"
    gap={10}
    offset={24}
    mobileOffset={16}
  />
);
