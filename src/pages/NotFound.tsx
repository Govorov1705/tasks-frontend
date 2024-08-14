import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center px-6 lg:px-8">
      <div className="text-center">
        <p className="font-semibold text-primary">404</p>
        <h1>Страница не найдена</h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          Простите, но такой страницы не существует.
        </p>
        <div className="mt-5 flex items-center justify-center">
          <Button>
            <Link to={"/"}>На главную</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
