"use client";

import { useEffect, useMemo, useState } from "react";

import {
  applyTaskFilter,
  createTask,
  parseStoredTasks,
  TASK_STORAGE_KEY,
  type TaskFilter,
  type TaskItem,
  validateTaskTitle,
} from "@/lib/tasks";

const FILTER_LABELS: Record<TaskFilter, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export function TaskBoard() {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>("all");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTasks(parseStoredTasks(window.localStorage.getItem(TASK_STORAGE_KEY)));
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  }, [mounted, tasks]);

  const visibleTasks = useMemo(() => applyTaskFilter(tasks, filter), [tasks, filter]);
  const activeCount = tasks.filter((task) => !task.completed).length;

  const onAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateTaskTitle(draft);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setTasks((current) => [createTask(draft), ...current]);
    setDraft("");
    setError(null);
  };

  return (
    <section className="board" aria-labelledby="task-board-title">
      <div className="board-head">
        <h2 id="task-board-title">Try the demo task board</h2>
        <p>Tasks stay in your browser using localStorage.</p>
      </div>

      <form className="task-form" onSubmit={onAddTask} noValidate>
        <label htmlFor="task-title" className="sr-only">
          Add task
        </label>
        <input
          id="task-title"
          name="task-title"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) {
              setError(null);
            }
          }}
          placeholder="Add a task"
          maxLength={120}
        />
        <button type="submit">Add</button>
      </form>

      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : null}

      <div className="filters" role="tablist" aria-label="Task filters">
        {(Object.keys(FILTER_LABELS) as TaskFilter[]).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            className={filter === value ? "is-active" : ""}
            onClick={() => setFilter(value)}
          >
            {FILTER_LABELS[value]}
          </button>
        ))}
      </div>

      {!mounted ? <p className="empty-state">Loading tasks…</p> : null}

      {mounted && tasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Add one to begin.</p>
      ) : null}

      {mounted && tasks.length > 0 && visibleTasks.length === 0 ? (
        <p className="empty-state">No tasks match this filter.</p>
      ) : null}

      <ul className="task-list" aria-live="polite">
        {visibleTasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {
                  setTasks((current) =>
                    current.map((candidate) =>
                      candidate.id === task.id
                        ? { ...candidate, completed: !candidate.completed }
                        : candidate,
                    ),
                  );
                }}
              />
              <span className={task.completed ? "is-complete" : ""}>{task.title}</span>
            </label>
            <button
              type="button"
              className="delete"
              onClick={() => {
                setTasks((current) => current.filter((candidate) => candidate.id !== task.id));
              }}
              aria-label={`Delete ${task.title}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p className="count">{activeCount} active task(s).</p>
    </section>
  );
}
