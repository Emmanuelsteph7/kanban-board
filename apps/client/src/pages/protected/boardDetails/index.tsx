import { useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useGetBoardById } from "../../../hooks/apis/boards";
import {
  useCreateColumn,
  useDeleteColumn,
  useRenameColumn,
} from "../../../hooks/apis/columns";
import {
  useCreateCard,
  useDeleteCard,
  useUpdateCard,
} from "../../../hooks/apis/cards";
import { BoardsQueryTag } from "../../../hooks/apis/types";
import { Path } from "../../../navigations/routes";
import Dialog from "../../../components/dialog";
import FormInput from "../../../components/formInput";
import Button from "../../../components/button";
import AvatarMenu from "../../../components/avatarMenu";
import { toast } from "../../../components/toast";
import type { Api } from "../../../types";

const DOT_COLORS = ["#8a7f74", "#c1602d", "#1c1a17"];

const relativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Updated just now";
  if (mins < 60) return `Updated ${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `Updated ${days}d ago`;
};

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

const textareaClass =
  "mt-1.5 w-full resize-none rounded-lg border border-transparent bg-ink/5 px-3 py-2.5 text-sm text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 ease-out focus:border-terracotta focus:bg-white focus:ring-4 focus:ring-terracotta-light";

type Column = Api.Boards.GetBoardById.Response["columns"][number];
type Card = Column["cards"][number];

const BoardDetails = () => {
  const { boardId = "" } = useParams();
  const queryClient = useQueryClient();
  const { data: board, isLoading } = useGetBoardById({ id: boardId });

  const [search, setSearch] = useState("");
  const [openColumnMenuId, setOpenColumnMenuId] = useState<string | null>(
    null,
  );

  const [createColumnOpen, setCreateColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const [renameColumnTarget, setRenameColumnTarget] = useState<Column | null>(
    null,
  );
  const [renameColumnValue, setRenameColumnValue] = useState("");

  const [cardTargetColumnId, setCardTargetColumnId] = useState<string | null>(
    null,
  );
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");

  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [BoardsQueryTag.GetBoardById],
    });

  const { mutateAsync: createColumn, isPending: isCreatingColumn } =
    useCreateColumn({
      onSuccess: () => {
        invalidate();
        toast.success({ title: "Column created" });
        setCreateColumnOpen(false);
        setNewColumnName("");
      },
    });

  const { mutateAsync: renameColumn, isPending: isRenamingColumn } =
    useRenameColumn({
      onSuccess: () => {
        invalidate();
        toast.success({ title: "Column renamed" });
        setRenameColumnTarget(null);
      },
    });

  const { mutate: deleteColumn } = useDeleteColumn({
    onSuccess: () => {
      invalidate();
      toast.success({ title: "Column deleted" });
    },
  });

  const { mutateAsync: createCard, isPending: isCreatingCard } =
    useCreateCard({
      onSuccess: () => {
        invalidate();
        toast.success({ title: "Card added" });
        setCardTargetColumnId(null);
        setCardTitle("");
        setCardDescription("");
      },
    });

  const { mutateAsync: updateCard, isPending: isUpdatingCard } =
    useUpdateCard({
      onSuccess: () => {
        invalidate();
        toast.success({ title: "Card updated" });
        setEditingCard(null);
      },
    });

  const { mutate: deleteCard } = useDeleteCard({
    onSuccess: () => {
      invalidate();
      toast.success({ title: "Card deleted" });
      setEditingCard(null);
    },
  });

  const columns = useMemo(() => {
    const cols = board?.columns ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return cols;
    return cols.map((col) => ({
      ...col,
      cards: col.cards.filter(
        (card) =>
          card.title.toLowerCase().includes(q) ||
          card.description.toLowerCase().includes(q),
      ),
    }));
  }, [board, search]);

  const handleCreateColumn = async (e: FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    await createColumn({ boardId, name: newColumnName.trim() });
  };

  const handleRenameColumn = async (e: FormEvent) => {
    e.preventDefault();
    if (!renameColumnTarget || !renameColumnValue.trim()) return;
    await renameColumn({
      id: renameColumnTarget.id,
      name: renameColumnValue.trim(),
    });
  };

  const handleDeleteColumn = (column: Column) => {
    setOpenColumnMenuId(null);
    if (window.confirm(`Delete "${column.name}" and all its cards?`)) {
      deleteColumn({ id: column.id });
    }
  };

  const handleCreateCard = async (e: FormEvent) => {
    e.preventDefault();
    if (!cardTargetColumnId || !cardTitle.trim()) return;
    await createCard({
      columnId: cardTargetColumnId,
      title: cardTitle.trim(),
      description: cardDescription.trim(),
    });
  };

  const handleUpdateCard = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCard || !editTitle.trim()) return;
    await updateCard({
      id: editingCard.id,
      columnId: editingCard.columnId,
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
  };

  const handleDeleteCard = () => {
    if (!editingCard) return;
    if (window.confirm(`Delete "${editingCard.title}"?`)) {
      deleteCard({ id: editingCard.id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-paper">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-ink/10 px-8 py-5">
        <div>
          <Link
            to={Path.Boards}
            className="text-[11px] tracking-wide text-clay transition-colors duration-150 ease-out hover:text-ink"
          >
            Boards /
          </Link>
          <h1 className="font-serif text-[22px] font-medium tracking-tight text-ink">
            {board?.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cards"
              className="h-9 w-56 rounded-lg border border-ink/10 bg-white pl-9 pr-3 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-out focus:border-terracotta focus:ring-4 focus:ring-terracotta-light"
            />
          </div>

          <Button
            type="button"
            onClick={() => setCreateColumnOpen(true)}
            icon={<PlusIcon />}
            label="New column"
            size="sm"
            fullWidth={false}
          />

          <AvatarMenu />
        </div>
      </div>

      <div className="relative flex-grow overflow-x-auto overflow-y-hidden px-8 py-6">
        {openColumnMenuId && (
          <div
            className="fixed inset-0"
            onClick={() => setOpenColumnMenuId(null)}
          />
        )}

        {board?.columns.length === 0 ? (
          <div className="animate-fade-up flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8a7f74"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                <rect x="3" y="4" width="7" height="16" rx="1.5" />
                <rect x="14" y="4" width="7" height="9" rx="1.5" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-ink">
                No columns yet
              </h2>
              <p className="mt-1.5 max-w-xs text-sm text-clay">
                Add a column to start moving cards through your workflow.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setCreateColumnOpen(true)}
              icon={<PlusIcon />}
              label="New column"
              size="sm"
              fullWidth={false}
            />
          </div>
        ) : (
        <div className="flex h-full gap-5">
          {columns.map((column, i) => {
            const dot = DOT_COLORS[i % DOT_COLORS.length];
            return (
              <div
                key={column.id}
                className="flex max-h-full w-[300px] flex-shrink-0 flex-col rounded-2xl bg-[#efeae1]"
              >
                <div className="flex flex-shrink-0 items-center justify-between px-3.5 pb-2.5 pt-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: dot }}
                    />
                    <span className="text-[13px] font-semibold text-ink">
                      {column.name}
                    </span>
                    <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-[11px] text-clay">
                      {column.cards.length}
                    </span>
                  </div>
                  <div className="relative flex items-center gap-0.5">
                    <button
                      type="button"
                      aria-label="Add card"
                      onClick={() => setCardTargetColumnId(column.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-clay transition-colors duration-150 ease-out hover:bg-ink/5"
                    >
                      <PlusIcon />
                    </button>
                    <button
                      type="button"
                      aria-label="Column options"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenColumnMenuId((id) =>
                          id === column.id ? null : column.id,
                        );
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-clay transition-colors duration-150 ease-out hover:bg-ink/5"
                    >
                      <DotsIcon />
                    </button>

                    {openColumnMenuId === column.id && (
                      <div className="animate-fade-in absolute right-0 top-8 z-10 w-36 rounded-lg border border-ink/10 bg-white p-1.5 shadow-[0_8px_24px_-8px_rgba(28,26,23,0.18)]">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenColumnMenuId(null);
                            setRenameColumnTarget(column);
                            setRenameColumnValue(column.name);
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors duration-150 ease-out hover:bg-ink/5"
                        >
                          <EditIcon />
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(column)}
                          className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-terracotta transition-colors duration-150 ease-out hover:bg-terracotta/10"
                        >
                          <TrashIcon />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 overflow-y-auto px-3.5 pb-3.5">
                  {column.cards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        setEditingCard(card);
                        setEditTitle(card.title);
                        setEditDescription(card.description);
                      }}
                      className="flex flex-col gap-2 rounded-xl border border-ink/[0.03] bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(28,26,23,0.06)] transition-transform duration-150 ease-out active:scale-[0.98]"
                    >
                      <div className="text-[13.5px] font-semibold leading-snug text-ink">
                        {card.title}
                      </div>
                      {card.description && (
                        <div className="line-clamp-2 text-xs leading-relaxed text-clay">
                          {card.description}
                        </div>
                      )}
                      <div className="mt-0.5 flex items-center justify-between">
                        <span className="text-[11px] text-clay">
                          {relativeTime(card.updatedAt)}
                        </span>
                        <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-ink/10 bg-paper" />
                      </div>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCardTargetColumnId(column.id)}
                    className="mt-0.5 flex h-9 items-center justify-center gap-1.5 rounded-lg border border-dashed border-clay/40 text-xs font-medium text-clay transition-colors duration-150 ease-out hover:border-clay/70 hover:text-ink"
                  >
                    <PlusIcon className="h-3 w-3" />
                    Add card
                  </button>
                </div>
              </div>
            );
          })}

          <div className="w-[220px] flex-shrink-0">
            <button
              type="button"
              onClick={() => setCreateColumnOpen(true)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-clay/40 text-sm font-medium text-clay transition-colors duration-150 ease-out hover:border-clay/70 hover:text-ink"
            >
              <PlusIcon />
              Add column
            </button>
          </div>
        </div>
        )}
      </div>

      <Dialog
        open={createColumnOpen}
        onClose={() => setCreateColumnOpen(false)}
        title="New column"
      >
        <form onSubmit={handleCreateColumn} className="space-y-4">
          <FormInput
            label="Column name"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="e.g. In review"
            autoFocus
          />
          <Button label="Create column" isLoading={isCreatingColumn} />
        </form>
      </Dialog>

      <Dialog
        open={!!renameColumnTarget}
        onClose={() => setRenameColumnTarget(null)}
        title="Rename column"
      >
        <form onSubmit={handleRenameColumn} className="space-y-4">
          <FormInput
            label="Column name"
            value={renameColumnValue}
            onChange={(e) => setRenameColumnValue(e.target.value)}
            autoFocus
          />
          <Button label="Save" isLoading={isRenamingColumn} />
        </form>
      </Dialog>

      <Dialog
        open={!!cardTargetColumnId}
        onClose={() => setCardTargetColumnId(null)}
        title="New card"
      >
        <form onSubmit={handleCreateCard} className="space-y-4">
          <FormInput
            label="Title"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            placeholder="e.g. Draft onboarding flow"
            autoFocus
          />
          <label className="block">
            <span className="text-sm font-medium text-ink">Description</span>
            <textarea
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              rows={3}
              className={textareaClass}
            />
          </label>
          <Button label="Add card" isLoading={isCreatingCard} />
        </form>
      </Dialog>

      <Dialog
        open={!!editingCard}
        onClose={() => setEditingCard(null)}
        title="Edit card"
      >
        <form onSubmit={handleUpdateCard} className="space-y-4">
          <FormInput
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <label className="block">
            <span className="text-sm font-medium text-ink">Description</span>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className={textareaClass}
            />
          </label>
          <div className="flex items-center gap-3">
            <Button label="Save changes" isLoading={isUpdatingCard} />
            <button
              type="button"
              onClick={handleDeleteCard}
              aria-label="Delete card"
              className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-lg border border-transparent text-terracotta transition-colors duration-150 ease-out hover:bg-terracotta/10"
            >
              <TrashIcon />
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default BoardDetails;
