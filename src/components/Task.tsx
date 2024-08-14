import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ITask } from "@/lib/definitions";
import {
  useDestroyTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/features/tasksApiSlice";
import { Pencil, Square, SquareCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";

type Props = {
  task: ITask;
  sortedTasks: ITask[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Task({ task, sortedTasks, page, setPage }: Props) {
  const [updateTask] = useUpdateTaskMutation();

  const [destroyTask] = useDestroyTaskMutation();

  const handleCheck = async () => {
    try {
      await updateTask({ ...task, is_done: !task.is_done });
    } catch (error) {}
  };

  const handleDelete = async () => {
    try {
      // Смена страницы на предыдущую при удалении задач для избежания 404
      if (page > 1 && sortedTasks.length % 10 === 1) {
        setPage(page - 1);
      }
      await destroyTask(task.id);
    } catch (error) {}
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div
        className={`w-full flex justify-between gap-1 shadow-md p-4 rounded-xl dark:bg-zinc-900 dark:text-zinc-200 h-26  ${
          task.is_done ? "line-through opacity-50" : ""
        }`}
      >
        <div
          className="min-w-0 w-full cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <h3 className="text-lg font-bold overflow-hidden whitespace-nowrap text-ellipsis">
            {task.name}
          </h3>
          <p className="text-md line-clamp-2 break-words break-all">
            {task.description}
          </p>
        </div>

        <div className="flex flex-col self-center gap-1">
          <button onClick={handleCheck}>
            {task.is_done ? <SquareCheck size={20} /> : <Square size={20} />}
          </button>

          <button onClick={() => setIsDialogOpen(true)}>
            <Pencil size={20} />
          </button>

          <button onClick={handleDelete}>
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование</DialogTitle>
          <DialogDescription className="sr-only">
            Окно редактирования задачи
          </DialogDescription>
        </DialogHeader>
        <EditTaskForm task={task} setIsDialogOpen={setIsDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}
