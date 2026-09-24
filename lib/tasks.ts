export type TaskFilter = "all" | "active" | "completed";

export type TaskItem = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

export const TASK_STORAGE_KEY = "bug-to-branch.tasks.v1";
const MAX_TITLE_LENGTH = 120;

export function validateTaskTitle(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return "Please enter a task.";
  }

  if (trimmed.length > MAX_TITLE_LENGTH) {
    return `Task must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  }

  return null;
}

export function createTask(title: string, now = Date.now()): TaskItem {
  return {
    id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
    title: title.trim(),
    completed: false,
    createdAt: now,
  };
}

export function applyTaskFilter(tasks: TaskItem[], filter: TaskFilter): TaskItem[] {
  if (filter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (filter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

export function parseStoredTasks(rawValue: string | null): TaskItem[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is TaskItem =>
        typeof item?.id === "string" &&
        typeof item?.title === "string" &&
        typeof item?.completed === "boolean" &&
        typeof item?.createdAt === "number",
    );
  } catch {
    return [];
  }
}
