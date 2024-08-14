import ResetPasswordForm from "@/components/ResetPasswordForm";
import { BookCheck } from "lucide-react";
import { useState } from "react";

export default function ResetPassword() {
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);

  return (
    <div>
      {!isFormFilledOut ? (
        <ResetPasswordForm setIsFormFilledOut={setIsFormFilledOut} />
      ) : (
        <div className="grid min-h-full place-items-center px-6 lg:px-8">
          <div className="text-center">
            <BookCheck className="mx-auto h-10 w-auto" />
            <h1>Проверьте почту</h1>
            <p className="mt-5">
              Мы отправили вам письмо на указанную электронную почту.
              <br />
              Перейдите по ссылке из письма, чтобы установить новый пароль.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
