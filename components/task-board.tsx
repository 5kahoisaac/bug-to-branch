"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  applyTaskFilter,
  createTask,
  parseStoredTasks,
  TASK_STORAGE_KEY,
  type TaskFilter,
  type TaskItem,
  validateTaskTitle,
} from "@/lib/tasks";
import { cn } from "@/lib/utils";

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
    <Card className="gap-0 border-border/80 bg-card/95" aria-labelledby="task-board-title">
      <CardHeader className="space-y-2">
        <CardTitle id="task-board-title" className="text-2xl tracking-tight">
          Try the demo task board
        </CardTitle>
        <CardDescription>Tasks stay in your browser using localStorage.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onAddTask} noValidate>
          <label htmlFor="task-title" className="sr-only">
            Add task
          </label>
          <Input
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
          <Button type="submit" className="sm:w-auto">
            Add
          </Button>
        </form>

        {error ? (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Task filters">
          {(Object.keys(FILTER_LABELS) as TaskFilter[]).map((value) => {
            const isActive = filter === value;

            return (
              <Button
                key={value}
                type="button"
                role="tab"
                size="sm"
                variant={isActive ? "default" : "outline"}
                aria-selected={isActive}
                onClick={() => setFilter(value)}
              >
                {FILTER_LABELS[value]}
              </Button>
            );
          })}
        </div>

        {!mounted ? <p className="text-sm text-muted-foreground">Loading tasks…</p> : null}

        {mounted && tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks yet. Add one to begin.</p>
        ) : null}

        {mounted && tasks.length > 0 && visibleTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks match this filter.</p>
        ) : null}

        <ul className="grid gap-2" aria-live="polite">
          {visibleTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-secondary/30 px-3 py-2"
            >
              <label className="flex min-w-0 items-center gap-2.5 text-sm">
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
                <span className={cn("truncate", task.completed && "text-muted-foreground line-through")}>
                  {task.title}
                </span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setTasks((current) => current.filter((candidate) => candidate.id !== task.id));
                }}
                aria-label={`Delete ${task.title}`}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>

        <Badge variant="outline" className="w-fit px-2.5 py-1 text-xs text-muted-foreground">
          {activeCount} active task(s).
        </Badge>
      </CardContent>
    </Card>
  );
}
