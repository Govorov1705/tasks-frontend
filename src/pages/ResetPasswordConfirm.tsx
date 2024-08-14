import ResetPasswordConfirmForm from "@/components/ResetPasswordConfirmForm";
import { useParams } from "react-router-dom";

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams();

  return (
    <div>
      <ResetPasswordConfirmForm uid={uid} token={token} />
    </div>
  );
}
