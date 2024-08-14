import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ITask } from "./definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortTasks(tasks: ITask[]) {
  const sortedTasks = tasks.slice().sort((a, b) => {
    if (a.is_done !== b.is_done) {
      return a.is_done ? 1 : -1;
    }
    return b.date_updated.localeCompare(a.date_updated);
  });
  return sortedTasks;
}
