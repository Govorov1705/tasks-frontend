import clsx from "clsx";
import { Loader } from "lucide-react";

type Props = {
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  center?: boolean;
};

export default function Spinner({ sm, md, lg, center }: Props) {
  const classNames = clsx("animate-spin", {
    "w-4 h-4": sm,
    "w-6 h-6": md,
    "w-8 h-8": lg,
    "mx-auto": center,
  });
  return (
    <div role="status">
      <Loader className={classNames} />
      <span className="sr-only">Загрузка...</span>
    </div>
  );
}
