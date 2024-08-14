import SignUpForm from "@/components/SignUpForm";
import { useResendActivationMutation } from "@/redux/features/authApiSlice";
import { BookCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { ISignUpFormStatus } from "../lib/definitions";

export default function SignUp() {
  const [formStatus, setFormStatus] = useState<ISignUpFormStatus>({
    isFilledOut: false,
    email: null,
  });

  const { isFilledOut, email } = formStatus;

  const [resendActivation] = useResendActivationMutation();

  const handleResend = async () => {
    try {
      await resendActivation(email).unwrap();
      toast.info("Письмо отправлено");
    } catch (error) {
      toast.error("Произошла ошибка");
    }
  };

  return (
    <div>
      {isFilledOut ? (
        <div className="grid min-h-full place-items-center px-6 lg:px-8">
          <div className="text-center">
            <BookCheck className="mx-auto h-10 w-auto" />
            <h1>Проверьте почту</h1>
            <p className="mt-5">
              Мы отправили вам письмо на указанную электронную почту.
              <br />
              Активируйте аккаунт, перейдя по ссылке из письма.
            </p>
            <p className="text-center text-sm mt-5">
              Не пришло письмо?{" "}
              <span
                role="button"
                className="font-semibold leading-6 text-primary hover:text-primary/90"
                onClick={handleResend}
              >
                Отправить еще раз
              </span>
            </p>
          </div>
        </div>
      ) : (
        <SignUpForm setFormStatus={setFormStatus} />
      )}
    </div>
  );
}
