import ResetEmailConfirmForm from "@/components/ResetEmailConfirmForm";
import { useParams } from "react-router-dom";

export default function ResetEmailConfirm() {
  const { uid, token } = useParams();

  return (
    <div>
      <ResetEmailConfirmForm uid={uid} token={token} />
    </div>
  );
}
