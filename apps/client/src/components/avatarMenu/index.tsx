import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/auth";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

const AvatarMenu = () => {
  const { handleLogoutSuccess } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-150 ease-out active:scale-[0.95]"
      >
        <UserIcon />
      </button>

      {open && (
        <div className="animate-fade-in absolute right-0 top-10 z-20 w-40 rounded-lg border border-ink/10 bg-white p-1.5 shadow-[0_8px_24px_-8px_rgba(28,26,23,0.18)]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              handleLogoutSuccess();
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-terracotta transition-colors duration-150 ease-out hover:bg-terracotta/10"
          >
            <LogoutIcon />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
