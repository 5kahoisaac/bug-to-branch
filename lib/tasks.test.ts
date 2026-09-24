import { describe, expect, it } from "vitest";

import {
  applyTaskFilter,
  createTask,
  parseStoredTasks,
  validateTaskTitle,
} from "./tasks";

describe("task utilities", () => {
  it("rejects empty task titles", () => {
    expect(validateTaskTitle("   ")).toBe("Please enter a task.");
  });

  it("creates a task with trimmed title", () => {
    const task = createTask("  Ship Bug to Branch  ", 123);
    expect(task.title).toBe("Ship Bug to Branch");
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBe(123);
  });

  it("filters tasks by status", () => {
    const tasks = [
      { id: "1", title: "One", completed: false, createdAt: 1 },
      { id: "2", title: "Two", completed: true, createdAt: 2 },
    ];

    expect(applyTaskFilter(tasks, "active")).toHaveLength(1);
    expect(applyTaskFilter(tasks, "completed")).toHaveLength(1);
    expect(applyTaskFilter(tasks, "all")).toHaveLength(2);
  });

  it("ignores invalid localStorage payloads", () => {
    expect(parseStoredTasks("not-json")).toEqual([]);
    expect(parseStoredTasks('{"wrong":true}')).toEqual([]);
  });
});
