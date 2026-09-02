import { Check, Trash2 } from "lucide-react";
import { type Task, type TaskStatus, STATUS_LABELS } from "@/types/task";
import { CategoryBadge } from "./category-badge";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const statusOptions: TaskStatus[] = ["not-started", "in-progress", "completed"];

const statusClasses: Record<TaskStatus, { circle: string; select: string }> = {
  "not-started": {
    circle: "border-status-not-started text-status-not-started hover:bg-status-not-started/10",
    select: "border-status-not-started text-status-not-started focus-visible:ring-status-not-started",
  },
  "in-progress": {
    circle: "border-status-in-progress text-status-in-progress hover:bg-status-in-progress/10",
    select: "border-status-in-progress text-status-in-progress focus-visible:ring-status-in-progress",
  },
  completed: {
    circle: "border-status-completed bg-status-completed text-status-completed-foreground hover:bg-status-completed/90",
    select: "border-status-completed text-status-completed focus-visible:ring-status-completed",
  },
};

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  const isCompleted = task.status === "completed";
  const statusStyle = statusClasses[task.status];

  return (
    <li
      className={cn(
        "group flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all task-card-shadow",
        isCompleted && "bg-muted/60"
      )}
    >
      <button
        type="button"
        onClick={() =>
          onStatusChange(
            task.id,
            isCompleted ? "not-started" : "completed"
          )
        }
        aria-label={isCompleted ? "Mark as not started" : "Mark as completed"}
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          statusStyle.circle
        )}
      >
        {isCompleted && <Check className="h-3.5 w-3.5" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <h3
            className={cn(
              "truncate text-base font-medium text-foreground transition-all",
              isCompleted && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </h3>
          <CategoryBadge category={task.category} />
        </div>

        {task.description ? (
          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          aria-label="Change task status"
          className={cn(
            "h-9 rounded-lg border bg-background px-2 text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            statusStyle.select
          )}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors",
            "hover:border-border hover:bg-destructive/10 hover:text-destructive",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
