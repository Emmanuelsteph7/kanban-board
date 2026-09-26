import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

const EXIT_DURATION = 150;

const Dialog = ({ open, onClose, title, description, children }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      const field = dialog.querySelector<HTMLElement>(
        "input, textarea, select",
      );
      field?.focus();
      const frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = setTimeout(() => {
      if (dialog.open) dialog.close();
    }, EXIT_DURATION);
    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-transparent p-0 open:flex"
    >
      <div
        className={`fixed inset-0 bg-ink/45 transition-opacity duration-150 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative m-auto w-full max-w-sm rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_24px_60px_-16px_rgba(28,26,23,0.28)] transition-[opacity,transform] ${
          visible
            ? "duration-200 opacity-100 scale-100"
            : "duration-150 opacity-0 scale-95"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <h2 className="font-serif text-lg font-medium tracking-tight text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-md p-1 text-clay transition-colors duration-150 ease-out hover:bg-ink/5 hover:text-ink"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {description && <p className="mb-5 text-sm text-clay">{description}</p>}
        {!description && <div className="mb-5" />}
        {children}
      </div>
    </dialog>
  );
};

export default Dialog;
