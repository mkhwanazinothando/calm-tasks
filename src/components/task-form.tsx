import { useState } from "react";
import { Plus } from "lucide-react";
import { DEFAULT_CATEGORIES, type TaskStatus } from "@/types/task";
import { cn } from "@/lib/utils";

const statusStyle = (status: TaskStatus) =>
  cn(
    "h-11 w-full rounded-xl border bg-background px-3 text-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    status === "not-started" && "border-status-not-started text-status-not-started",
    status === "in-progress" && "border-status-in-progress text-status-in-progress",
    status === "completed" && "border-status-completed text-status-completed"
  );

interface TaskFormProps {
  onAddTask: (task: {
    title: string;
    description: string;
    category: string;
    status: TaskStatus;
  }) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0]);
  const [status, setStatus] = useState<TaskStatus>("not-started");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAddTask({
      title: trimmed,
      description: "",
      category,
      status,
    });

    setTitle("");
    setCategory(DEFAULT_CATEGORIES[0]);
    setStatus("not-started");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-5 task-card-shadow"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="task-title"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Task name
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={cn(
                "h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            />
          </div>

          <div className="sm:w-40">
            <label
              htmlFor="task-category"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Category
            </label>
            <select
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={cn(
                "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-40">
            <label
              htmlFor="task-status"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Status
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className={cn(
                "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors",
              "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </form>
  );
}
