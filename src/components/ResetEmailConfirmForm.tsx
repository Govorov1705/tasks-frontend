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
import type { IResetEmailConfirmAPIError } from "@/lib/definitions";
import { useConfirmEmailResetMutation } from "@/redux/features/authApiSlice";
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

export default function ResetEmailConfirmForm({ uid, token }: Props) {
  const formSchema = z
    .object({
      new_email: z
        .string()
        .min(1, "Обязательное поле.")
        .email("Введите корректный Email.")
        .max(154, "Email не должен быть длинее 154 символов."),
      re_new_email: z
        .string()
        .min(1, "Обязательное поле.")
        .email("Введите корректный Email.")
        .max(154, "Email не должен быть длинее 154 символов."),
    })
    .refine((schema) => schema.new_email === schema.re_new_email, {
      message: "Введенные Email-адреса не совпадают.",
      path: ["re_new_email"],
    });

  type FormInputs = z.infer<typeof formSchema>;

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_email: "",
      re_new_email: "",
    },
  });

  const [confirmEmailReset, { isLoading }] = useConfirmEmailResetMutation();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    try {
      await confirmEmailReset({ uid, token, ...data }).unwrap();
      toast.success("Email изменен.");
      navigate("/auth/sign-in", { replace: true });
    } catch (error) {
      console.log(error);
      const apiError = error as IResetEmailConfirmAPIError;
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
            <CardTitle className="text-xl">Смена Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-[0.8rem] font-medium text-destructive">
              {form.formState.errors.root?.message}
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="new_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Новый Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field}></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="re_new_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Повторите Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field}></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner sm /> : "Сменить Email"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
