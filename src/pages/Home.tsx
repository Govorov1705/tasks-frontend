import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import { Link } from "react-router-dom";

export default function Home() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="relative isolate px-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-40 lg:py-48">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Создавайте и отслеживайте задачи
          </h1>
          <p className="mt-6 text-lg leading-8">
            Tasks - приложение для создания и отслеживания задач, которое
            повысит вашу продуктивность.
          </p>
          {isAuthenticated && (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/tasks" className="text-sm font-semibold leading-6 ">
                Задачи <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}
          {!isAuthenticated && (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button>
                <Link to="/auth/sign-in" className="text-primary-foreground">
                  Войти
                </Link>
              </Button>
              <Link
                to="/auth/sign-up"
                className="text-sm font-semibold leading-6"
              >
                Создать аккаунт <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
