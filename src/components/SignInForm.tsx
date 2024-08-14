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
import type { ISignInAPIError } from "@/lib/definitions";
import { useSignInMutation } from "@/redux/features/authApiSlice";
import { signIn as signInAction } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "./Spinner";

export default function SignInForm() {
  const formSchema = z.object({
    email: z
      .string()
      .min(1, "Обязательное поле.")
      .email("Введите корректный Email."),
    password: z.string().min(1, "Обязательное поле."),
  });

  type FormInputs = z.infer<typeof formSchema>;

  const [signIn, { isLoading }] = useSignInMutation();

  const dispatch = useAppDispatch();

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await signIn(data).unwrap();
      dispatch(signInAction());
      toast.success("Вход выполнен.");
      navigate("/", { replace: true });
    } catch (error) {
      const apiError = error as ISignInAPIError;
      const message = apiError.data.detail;
      form.setError("root", { type: "server", message });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Авторизация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-[0.8rem] font-medium text-destructive">
              {form.formState.errors.root?.message}
            </div>
            <div className="grid gap-4">
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
                      <div className="flex items-center">
                        <FormLabel>Пароль</FormLabel>
                        <Link
                          to="/auth/reset-password"
                          className="ml-auto inline-block text-sm underline text-primary hover:text-primary/90"
                        >
                          Забыли пароль?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field}></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner sm /> : "Войти"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Еще нет аккаунта?{" "}
              <Link
                to="/auth/sign-up"
                className="underline text-primary hover:text-primary/90"
              >
                Создать аккаунт
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
