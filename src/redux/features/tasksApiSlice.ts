import type { INewTask, ITask, ITaskListAPIResponse } from "@/lib/definitions";

import { apiSlice } from "../services/apiSlice";

const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listTasks: builder.query<ITaskListAPIResponse, Number | void>({
      query: (page = 1) => ({
        url: `tasks/?page=${page}`,
      }),
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation<ITask, INewTask>({
      query: (newTask) => ({
        url: "tasks/",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation<void, ITask>({
      query: (updatedTask) => ({
        url: `tasks/${updatedTask.id}/`,
        method: "PUT",
        body: updatedTask,
      }),
      invalidatesTags: ["Tasks"],
    }),
    destroyTask: builder.mutation<void, Number>({
      query: (taskId) => ({
        url: `tasks/${taskId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useListTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDestroyTaskMutation,
} = tasksApiSlice;
