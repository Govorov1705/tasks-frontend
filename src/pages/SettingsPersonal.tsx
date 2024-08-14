import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useRetrieveUserQuery,
  useUpdateProfileMutation,
} from "@/redux/features/authApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { isEqual } from "underscore";
import { z } from "zod";

export default function SettingsPersonal() {
  const { data: user, isLoading, isSuccess, isError } = useRetrieveUserQuery();

  const [updateProfile, { isLoading: isUpdateLoading }] =
    useUpdateProfileMutation();

  const formSchema = z.object({
    first_name: z
      .string()
      .min(1, "Обязательное поле.")
      .max(50, "Имя не должно быть длиннее 50 символов."),
    last_name: z
      .string()
      .min(1, "Обязательное поле.")
      .max(50, "Фамилия не должна быть длиннее 50 символов."),
  });

  type FormInputs = z.infer<typeof formSchema>;

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
      });
    }
  }, [user, form]);

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    if (
      !isEqual(
        { first_name: user?.first_name, last_name: user?.last_name },
        { ...data }
      )
    ) {
      try {
        await updateProfile(data);
        toast.success("Данные профиля обновлены");
      } catch (error) {
        toast.error("Ошибка обновления данных профиля");
      }
    }
  };

  let content;

  if (isLoading) {
    content = <Spinner lg />;
  } else if (isSuccess) {
    content = (
      <div className="grid gap-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Личные данные</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Иван"
                                autoComplete="off"
                                {...field}
                              ></Input>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Фамилия</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Иванов"
                                autoComplete="off"
                                {...field}
                              ></Input>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  type="submit"
                  className="w-24"
                  disabled={isUpdateLoading}
                >
                  {isUpdateLoading ? <Spinner sm /> : "Сохранить"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    );
  } else if (isError) {
    content = (
      <h3 className="font-medium text-destructive">Ошибка загрузки...</h3>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-5 md:w-4/5 md:mx-auto lg:w-3/5 lg:mx-auto">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Настройки</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[150px_1fr] lg:grid-cols-[200px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/settings/personal" className="font-semibold text-primary">
            Личные данные
          </Link>
          <Link to="/settings/security">Безопасность</Link>
        </nav>
        {content}
      </div>
    </div>
  );
}
