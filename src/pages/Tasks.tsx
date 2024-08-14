import AddTaskForm from "@/components/AddTaskForm";
import Spinner from "@/components/Spinner";
import TaskList from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sortTasks } from "@/lib/utils";
import { useListTasksQuery } from "@/redux/features/tasksApiSlice";
import { useState } from "react";

export default function Tasks() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isSuccess, isError } = useListTasksQuery(page);

  let content;

  if (isLoading) {
    content = <Spinner lg />;
  } else if (isSuccess) {
    const sortedTasks = sortTasks(data.results);
    content = (
      <TaskList
        sortedTasks={sortedTasks}
        count={data.count}
        page={page}
        setPage={setPage}
      />
    );
  } else if (isError) {
    content = (
      <h3 className="font-medium text-destructive">Ошибка загрузки...</h3>
    );
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="h-full w-full flex flex-col items-center gap-5">
      <h2>Задачи</h2>
      <div className="flex flex-col items-center gap-5">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            Добавить
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новая задача</DialogTitle>
              <DialogDescription className="sr-only">
                Окно создания задачи
              </DialogDescription>
            </DialogHeader>
            <AddTaskForm setIsDialogOpen={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
        {data?.results?.length === 0 && (
          <h3 className="text-md leading-9 tracking-tight text-gray-900 dark:text-zinc-200">
            Задач пока нет...
          </h3>
        )}
      </div>
      {content}
    </div>
  );
}
