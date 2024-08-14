import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ITask } from "@/lib/definitions";
import Task from "./Task";

type Props = {
  sortedTasks: ITask[];
  count: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const PAGE_SIZE = 10;

export default function TaskList({ sortedTasks, count, page, setPage }: Props) {
  const totalPages = Math.ceil(count / PAGE_SIZE);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="h-full w-full md:w-4/5 lg:w-1/2 flex-col flex gap-5 items-center">
      {sortedTasks.map((task) => (
        <Task task={task} key={task.id} sortedTasks={sortedTasks} page={page} setPage={setPage}/>
      ))}
      {count > 10 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePreviousPage()}
                className={page === 1 ? "opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => handleNextPage()}
                className={
                  page === totalPages ? "opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
