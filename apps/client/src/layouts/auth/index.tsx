import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../contexts/auth";
import { Path } from "../../navigations/routes";
import BoardIllustration from "../../components/boardIllustration";

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={Path.Boards} replace />;
  }

  return (
    <div className="min-h-screen bg-ink p-2 sm:p-3">
      <div className="flex min-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-xl bg-paper sm:min-h-[calc(100vh-1.5rem)] sm:rounded-2xl lg:flex-row">
        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-ink p-6 text-paper sm:p-10 lg:w-[42%]">
          <div
            className="flex items-center gap-2 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-2 w-2 rounded-full bg-terracotta" />
            <span className="font-serif text-lg font-medium">Driftboard</span>
          </div>

          <div className="absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-terracotta/20 blur-3xl" />
          <div className="absolute -left-10 bottom-1/4 h-40 w-40 rounded-full bg-terracotta/10 blur-2xl" />

          <BoardIllustration className="relative my-10 hidden h-48 w-auto shrink-0 self-start lg:block" />

          <div className="relative hidden lg:block">
            <p
              className="animate-fade-up font-serif text-4xl font-medium leading-tight tracking-tight"
              style={{ animationDelay: "220ms" }}
            >
              Every board, every card, right where you left them.
            </p>
            <p
              className="animate-fade-up mt-4 max-w-sm text-sm text-paper/60"
              style={{ animationDelay: "280ms" }}
            >
              No clutter, no ceremony. Just a place to move work forward, one
              card at a time.
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:py-16">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
