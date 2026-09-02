import { ClipboardList } from "lucide-react";
import { type Task, type TaskStatus } from "@/types/task";
import { TaskItem } from "./task-item";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  filter: TaskStatus | "all";
  onFilterChange: (filter: TaskStatus | "all") => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const filters: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function TaskList({
  tasks,
  filter,
  onFilterChange,
  onStatusChange,
  onDelete,
}: TaskListProps) {
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 task-card-shadow">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your tasks</h2>

        <div
          role="tablist"
          aria-label="Filter tasks by status"
          className="inline-flex rounded-xl border border-border bg-muted p-1"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => onFilterChange(f.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground">
            No tasks found
          </h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {filter === "all"
              ? "Add a new task above to start organizing your day."
              : "No tasks match this status. Try a different filter."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
