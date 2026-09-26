import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../contexts/auth";
import { Path } from "../../navigations/routes";

const COPY: Record<
  string,
  { heading: string[]; paragraph: string; footer: "stats" | "columns" }
> = {
  [Path.Login]: {
    heading: ["Every board,", "a clear line of", "sight to done."],
    paragraph:
      "Organize projects into boards, columns and cards — built for teams who'd rather move work than manage tools.",
    footer: "stats",
  },
  [Path.SignUp]: {
    heading: ["Three columns.", "One clear next", "step, always."],
    paragraph:
      "No setup ceremony — create a board, add columns, drop in your first cards.",
    footer: "columns",
  },
};

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const copy = COPY[pathname] ?? COPY[Path.Login];

  if (isAuthenticated) {
    return <Navigate to={Path.Boards} replace />;
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <div className="relative hidden w-[478px] flex-shrink-0 flex-col justify-between overflow-hidden bg-ink p-10 text-paper lg:flex">
        <div className="absolute -right-24 -top-24 h-[340px] w-[340px] rounded-full bg-terracotta/35 blur-[2px]" />
        <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full border border-terracotta/30" />

        <div
          className="animate-fade-up relative flex items-center gap-2.5"
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-terracotta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="18" rx="1.5" fill="#f6f3ee" />
              <rect
                x="14"
                y="3"
                width="7"
                height="10"
                rx="1.5"
                fill="#f6f3ee"
              />
            </svg>
          </div>
          <span className="font-serif text-lg font-medium tracking-tight">
            Kanbn
          </span>
        </div>

        <div
          className="animate-fade-up relative"
          style={{ animationDelay: "80ms" }}
        >
          <h1 className="font-serif text-[40px] font-medium leading-[1.12] tracking-tight">
            {copy.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <div className="mt-5 h-[3px] w-8 bg-terracotta" />
          <p className="mt-5 max-w-[330px] text-sm leading-relaxed text-paper/60">
            {copy.paragraph}
          </p>
        </div>

        <div
          className="animate-fade-up relative"
          style={{ animationDelay: "160ms" }}
        >
          {copy.footer === "stats" ? (
            <div className="flex gap-6">
              <div>
                <div className="font-serif text-xl font-medium">12k+</div>
                <div className="mt-0.5 text-xs text-paper/40">
                  boards created
                </div>
              </div>
              <div>
                <div className="font-serif text-xl font-medium">98%</div>
                <div className="mt-0.5 text-xs text-paper/40">
                  on-time delivery
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 flex-1 rounded-lg border border-paper/10 bg-paper/[0.04] p-2.5"
                >
                  <div
                    className={`mb-2 h-1 w-6 rounded-full ${
                      i === 0 ? "bg-terracotta" : "bg-paper/25"
                    }`}
                  />
                  <div
                    className="h-1 rounded-full bg-paper/20"
                    style={{ width: `${70 - i * 15}%` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:py-16">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
