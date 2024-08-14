import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ISignUpAPIError, ISignUpFormStatus } from "../lib/definitions";
import { useSignUpMutation } from "../redux/features/authApiSlice";
import Spinner from "./Spinner";

export default function SignUpForm({
  setFormStatus,
}: {
  setFormStatus: React.Dispatch<React.SetStateAction<ISignUpFormStatus>>;
}) {
  const formSchema = z
    .object({
      email: z
        .string()
        .min(1, "Обязательное поле.")
        .email("Введите корректный Email.")
        .max(154, "Email не должен быть длинее 154 символов."),
      first_name: z
        .string()
        .min(1, "Обязательное поле.")
        .max(50, "Имя не должно быть длиннее 50 символов."),
      last_name: z
        .string()
        .min(1, "Обязательное поле.")
        .max(50, "Фамилия не должна быть длиннее 50 символов."),
      password: z
        .string()
        .min(8, "Пароль должен содержать как минимум 8 символов.")
        .max(50, "Пароль не должен содержать более 50 символов.")
        .refine(
          (value) => /\D/.test(value),
          "Пароль не должен состоять только из цифр."
        ),
      re_password: z
        .string()
        .min(8, "Пароль должен содержать как минимум 8 символов.")
        .max(50, "Пароль не должен содержать более 50 символов.")
        .refine(
          (value) => /\D/.test(value),
          "Пароль не должен состоять только из цифр."
        ),
    })
    .refine((schema) => schema.password === schema.re_password, {
      message: "Пароли не совпадают.",
      path: ["re_password"],
    });

  type FormInputs = z.infer<typeof formSchema>;

  const [signUp, { isLoading }] = useSignUpMutation();

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      re_password: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    try {
      await signUp(data).unwrap();
      setFormStatus({
        isFilledOut: true,
        email: data.email,
      });
    } catch (error) {
      const apiError = error as ISignUpAPIError;
      for (const [field, messages] of Object.entries(apiError.data)) {
        if (messages) {
          for (const message of messages) {
            form.setError(field as keyof FormInputs, {
              type: "server",
              message,
            });
          }
        }
      }
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Создание аккаунта</CardTitle>
          </CardHeader>
          <CardContent>
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
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="mail@example.com"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input type="password" {...field}></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="re_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Повторите пароль</FormLabel>
                      <FormControl>
                        <Input type="password" {...field}></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner sm /> : "Создать аккаунт"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Уже есть аккаунт?{" "}
              <Link
                to="/auth/sign-in"
                className="underline text-primary hover:text-primary/90"
              >
                Войти
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
