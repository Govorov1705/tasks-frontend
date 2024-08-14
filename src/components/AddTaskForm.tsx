import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTaskMutation } from "@/redux/features/tasksApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export default function AddTaskForm({
  setIsDialogOpen,
}: {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const formSchema = z.object({
    name: z
      .string()
      .min(1, "Обязательное поле.")
      .max(50, "Название не должно содержать более 50 символов."),
    description: z
      .string()
      .max(500, "Описание не должно содержать более 500 символов.")
      .optional(),
  });

  type formInputs = z.infer<typeof formSchema>;

  const form = useForm<formInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [createTask] = useCreateTaskMutation();

  const handleAdd: SubmitHandler<formInputs> = async (data) => {
    try {
      await createTask(data);
      form.reset();
    } catch (error) {}
    setIsDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAdd)}>
        <div className="mb-2 text-[0.8rem] font-medium text-destructive">
          {form.formState.errors.root?.message}
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input type="text" autoComplete="off" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={10}
                      className="resize-none"
                      {...field}
                    ></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <button className="mx-auto border-none cursor-pointer">
            <Save size={20} />
          </button>
        </div>
      </form>
    </Form>
  );
}
