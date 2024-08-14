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
import { IResetPasswordConfirmAPIError } from "@/lib/definitions";
import { useConfirmPasswordResetMutation } from "@/redux/features/authApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "./Spinner";

type Props = {
  uid: string | undefined;
  token: string | undefined;
};

export default function ResetPasswordConfirmForm({ uid, token }: Props) {
  const formSchema = z
    .object({
      new_password: z
        .string()
        .min(8, "Пароль должен содержать как минимум 8 символов.")
        .max(50, "Пароль не должен содержать более 50 символов.")
        .refine(
          (value) => /\D/.test(value),
          "Пароль не должен состоять только из цифр."
        ),
      re_new_password: z
        .string()
        .min(8, "Пароль должен содержать как минимум 8 символов.")
        .max(50, "Пароль не должен содержать более 50 символов.")
        .refine(
          (value) => /\D/.test(value),
          "Пароль не должен состоять только из цифр."
        ),
    })
    .refine((schema) => schema.new_password === schema.re_new_password, {
      message: "Пароли не совпадают.",
      path: ["re_new_password"],
    });

  type FormInputs = z.infer<typeof formSchema>;

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password: "",
      re_new_password: "",
    },
  });

  const [confirmPasswordReset, { isLoading }] =
    useConfirmPasswordResetMutation();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    try {
      await confirmPasswordReset({ uid, token, ...data }).unwrap();
      toast.success("Пароль изменен.");
      navigate("/auth/sign-in", { replace: true });
    } catch (error) {
      const apiError = error as IResetPasswordConfirmAPIError;
      for (const [field, messages] of Object.entries(apiError.data)) {
        if (field !== "token" && field !== "uid") {
          if (messages) {
            for (const message of messages) {
              form.setError(field as keyof FormInputs, {
                type: "server",
                message,
              });
            }
          }
        } else {
          form.setError("root", {
            type: "server",
            message: "Недействительный токен.",
          });
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Смена пароля</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-[0.8rem] font-medium text-destructive">
              {form.formState.errors.root?.message}
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Новый пароль</FormLabel>
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
                  name="re_new_password"
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
                {isLoading ? <Spinner sm /> : "Сменить пароль"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
