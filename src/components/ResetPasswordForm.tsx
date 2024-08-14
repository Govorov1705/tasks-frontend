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
import { useResetPasswordMutation } from "@/redux/features/authApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Spinner from "./Spinner";

export default function ResetPasswordForm({
  setIsFormFilledOut,
}: {
  setIsFormFilledOut: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const formSchema = z.object({
    email: z
      .string()
      .min(1, "Обязательное поле.")
      .email("Введите корректный Email."),
  });

  type FormInputs = z.infer<typeof formSchema>;

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    try {
      await resetPassword(data.email).unwrap();
      setIsFormFilledOut(true);
    } catch (error) {
      form.setError("root", { message: "Ошибка отправки письма." });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Восстановление аккаунта</CardTitle>
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner sm /> : "Отправить"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
