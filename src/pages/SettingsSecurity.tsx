import Spinner from "@/components/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useResetEmailMutation,
  useResetPasswordMutation,
  useRetrieveUserQuery,
} from "@/redux/features/authApiSlice";
import { KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SettingsSecurity() {
  const { data: user, isLoading, isSuccess, isError } = useRetrieveUserQuery();

  const [resetEmail, { isLoading: isEmailResetLoading }] =
    useResetEmailMutation();

  const [isEmailResetRequested, setIsEmailResetRequested] = useState(false);

  const [isPasswordResetRequested, setIsPasswordResetRequested] =
    useState(false);

  const [resetPassword, { isLoading: isPasswordResetLoading }] =
    useResetPasswordMutation();

  const handleEmailReset = async () => {
    try {
      await resetEmail(user?.email).unwrap();
      setIsEmailResetRequested(true);
      toast.info(
        `Мы отправили письмо на вашу электронную почту.
        Перейдите по ссылке из письма, чтобы сменить почту.`
      );
    } catch (error) {}
  };

  const handlePasswordReset = async () => {
    try {
      await resetPassword(user?.email).unwrap();
      setIsPasswordResetRequested(true);
      toast.info(
        `Мы отправили письмо на вашу электронную почту.
        Перейдите по ссылке из письма, чтобы установить новый пароль.`
      );
    } catch (error) {}
  };

  let content;

  if (isLoading) {
    content = <Spinner lg />;
  } else if (isSuccess) {
    content = (
      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Безопасность</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex justify-between">
              <div className="flex gap-1">
                <Mail className="self-center" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none">
                    Email
                  </span>
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
              {!isEmailResetRequested && (
                <button
                  onClick={handleEmailReset}
                  className={cn("text-sm self-center", {
                    "text-primary": !isEmailResetLoading,
                  })}
                >
                  {isEmailResetLoading ? <Spinner sm /> : "Изменить"}
                </button>
              )}
            </div>
            <div className="flex justify-between">
              <div className="flex gap-1 items-center">
                <KeyRound />
                <span className="text-sm font-medium leading-none">Пароль</span>
              </div>
              {!isPasswordResetRequested && (
                <button
                  onClick={handlePasswordReset}
                  className={cn("text-sm", {
                    "text-primary": !isPasswordResetLoading,
                  })}
                >
                  {isPasswordResetLoading ? <Spinner sm /> : "Изменить"}
                </button>
              )}
            </div>
          </CardContent>
        </Card>
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
          <Link to="/settings/personal">Личные данные</Link>
          <Link to="/settings/security" className="font-semibold text-primary">
            Безопасность
          </Link>
        </nav>
        {content}
      </div>
    </div>
  );
}
