import Spinner from "@/components/Spinner";
import { useActivateMutation } from "@/redux/features/authApiSlice";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function Activation() {
  const { uid, token } = useParams();

  const navigate = useNavigate();

  const [activate] = useActivateMutation();
  useEffect(() => {
    activate({ uid, token })
      .unwrap()
      .then(() => {
        toast.success("Аккаунт активирован.");
        navigate("/auth/sign-in", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Недействительный токен.");
        navigate("/auth/sign-in", { replace: true });
      });
  }, [uid, token]);
  return <Spinner lg center />;
}
