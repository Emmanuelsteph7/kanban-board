import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateBoard,
  useDeleteBoard,
  useGetBoards,
  useRenameBoard,
} from "../../../hooks/apis/boards";
import { BoardsQueryTag } from "../../../hooks/apis/types";
import { Path } from "../../../navigations/routes";
import Dialog from "../../../components/dialog";
import FormInput from "../../../components/formInput";
import Button from "../../../components/button";
import AvatarMenu from "../../../components/avatarMenu";
import { toast } from "../../../components/toast";
import type { Api } from "../../../types";

const ACCENTS = ["#c1602d", "#1c1a17"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-clay"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4-4" />
  </svg>
);

const PlusIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-3.5 w-3.5"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-3.5 w-3.5"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
  </svg>
);

const BoardIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <rect x="3" y="3" width="7" height="18" rx="1.5" fill={color} />
    <rect x="14" y="3" width="7" height="10" rx="1.5" fill={color} />
  </svg>
);

const BoardList = () => {
  const queryClient = useQueryClient();
  const { data: boards, isLoading } = useGetBoards();

  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const [renameTarget, setRenameTarget] = useState<Api.Boards.Board | null>(
    null,
  );
  const [renameValue, setRenameValue] = useState("");

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [BoardsQueryTag.GetBoards] });

  const { mutateAsync: createBoard, isPending: isCreating } = useCreateBoard({
    onSuccess: () => {
      invalidate();
      toast.success({ title: "Board created" });
      setCreateOpen(false);
      setNewBoardName("");
    },
  });

  const { mutateAsync: renameBoard, isPending: isRenaming } = useRenameBoard({
    onSuccess: () => {
      invalidate();
      toast.success({ title: "Board renamed" });
      setRenameTarget(null);
    },
  });

  const { mutate: deleteBoard } = useDeleteBoard({
    onSuccess: () => {
      invalidate();
      toast.success({ title: "Board deleted" });
    },
  });

  const filteredBoards = useMemo(() => {
    if (!boards) return [];
    const q = search.trim().toLowerCase();
    if (!q) return boards;
    return boards.filter((board) => board.name.toLowerCase().includes(q));
  }, [boards, search]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    await createBoard({ name: newBoardName.trim() });
  };

  const handleRename = async (e: FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !renameValue.trim()) return;
    await renameBoard({ id: renameTarget.id, name: renameValue.trim() });
  };

  const handleDelete = (board: Api.Boards.Board) => {
    setOpenMenuId(null);
    if (window.confirm(`Delete "${board.name}"? This can't be undone.`)) {
      deleteBoard({ id: board.id });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-paper">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-ink/10 px-8 py-5">
        <div>
          <div className="text-[11px] tracking-wide text-clay">Workspace</div>
          <h1 className="font-serif text-[22px] font-medium tracking-tight text-ink">
            Boards
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search boards"
              className="h-9 w-56 rounded-lg border border-ink/10 bg-white pl-9 pr-3 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-out focus:border-terracotta focus:ring-4 focus:ring-terracotta-light"
            />
          </div>

          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            icon={<PlusIcon />}
            label="New board"
            size="sm"
            fullWidth={false}
          />

          <AvatarMenu />
        </div>
      </div>

      <div className="relative flex-grow overflow-y-auto px-8 py-7">
        {openMenuId && (
          <div className="fixed inset-0" onClick={() => setOpenMenuId(null)} />
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[140px] animate-pulse rounded-2xl border border-ink/10 bg-ink/5"
              />
            ))}
          </div>
        ) : filteredBoards.length === 0 && search ? (
          <p className="py-16 text-center text-sm text-clay">
            No boards match "{search}".
          </p>
        ) : boards?.length === 0 ? (
          <div className="animate-fade-up flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5">
              <BoardIcon color="#8a7f74" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-ink">
                No boards yet
              </h2>
              <p className="mt-1.5 max-w-xs text-sm text-clay">
                Create your first board to start organizing projects into
                columns and cards.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setCreateOpen(true)}
              icon={<PlusIcon />}
              label="New board"
              size="sm"
              fullWidth={false}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBoards.map((board, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <div
                  key={board.id}
                  className="animate-fade-up relative"
                  style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
                >
                  <Link
                    to={`${Path.Boards}/${board.id}`}
                    className="block rounded-2xl border border-ink/10 bg-white p-4.5 transition-colors duration-150 ease-out hover:border-ink/25"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex h-8.5 w-8.5 items-center justify-center rounded-lg"
                        style={{ background: `${accent}1a` }}
                      >
                        <BoardIcon color={accent} />
                      </div>
                      <button
                        type="button"
                        aria-label="Board options"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId((id) =>
                            id === board.id ? null : board.id,
                          );
                        }}
                        className="flex h-6.5 w-6.5 items-center justify-center rounded-md text-clay transition-colors duration-150 ease-out hover:bg-ink/5"
                      >
                        <DotsIcon />
                      </button>
                    </div>

                    <div className="mt-4 font-serif text-[17px] font-medium tracking-tight text-ink">
                      {board.name}
                    </div>
                    <div className="mt-1.5 text-xs text-clay">
                      Created {formatDate(board.createdAt)}
                    </div>
                  </Link>

                  {openMenuId === board.id && (
                    <div className="animate-fade-in absolute right-4 top-12 z-10 w-36 rounded-lg border border-ink/10 bg-white p-1.5 shadow-[0_8px_24px_-8px_rgba(28,26,23,0.18)]">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          setRenameTarget(board);
                          setRenameValue(board.name);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors duration-150 ease-out hover:bg-ink/5"
                      >
                        <EditIcon />
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(board)}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-terracotta transition-colors duration-150 ease-out hover:bg-terracotta/10"
                      >
                        <TrashIcon />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-clay/40 text-clay transition-colors duration-150 ease-out hover:border-clay/70 hover:text-ink"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5">
                <PlusIcon />
              </span>
              <span className="text-sm font-medium">New board</span>
            </button>
          </div>
        )}
      </div>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New board"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormInput
            label="Board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="e.g. Product Launch"
            autoFocus
          />
          <Button label="Create board" isLoading={isCreating} />
        </form>
      </Dialog>

      <Dialog
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        title="Rename board"
      >
        <form onSubmit={handleRename} className="space-y-4">
          <FormInput
            label="Board name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
          />
          <Button label="Save" isLoading={isRenaming} />
        </form>
      </Dialog>
    </div>
  );
};

export default BoardList;
