import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  useLogoutMutation,
  useRetrieveUserQuery,
} from "@/redux/features/authApiSlice";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { apiSlice } from "@/redux/services/apiSlice";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { BookCheck, CircleUser, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [skip, setSkip] = useState(true);

  const { data: user } = useRetrieveUserQuery(undefined, { skip });

  useEffect(() => {
    if (isAuthenticated) {
      setSkip(false);
    }
  }, [isAuthenticated, setSkip]);

  const dispatch = useAppDispatch();

  const [logout] = useLogoutMutation();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        dispatch(apiSlice.util.resetApiState());
        setSkip(true);
        dispatch(logoutAction());
        toast.info("Вы вышли из аккаунта.");
      })
      .finally(() => {
        navigate("/auth/sign-in", { replace: true });
        if (isSheetOpen) {
          handleLinkClick();
        }
      });
  };

  const handleLinkClick = () => {
    if (isSheetOpen) {
      setIsSheetOpen(false);
    }
  };

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <BookCheck className="h-6 w-6" />
          <span className="sr-only">Tasks</span>
        </Link>
        <Link
          to="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Главная
        </Link>
        {isAuthenticated && (
          <Link
            to="/tasks"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Задачи
          </Link>
        )}
      </nav>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Открыть меню навигации</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <DialogTitle className="sr-only">Меню</DialogTitle>
          <DialogDescription className="sr-only">
            Навигационные ссылки
          </DialogDescription>
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <BookCheck className="h-6 w-6" />
              <span className="sr-only">Tasks</span>
            </Link>
            <Link
              to="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={handleLinkClick}
            >
              Главная
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/tasks"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  onClick={handleLinkClick}
                >
                  Задачи
                </Link>
                <Link
                  to="/settings/personal"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  onClick={handleLinkClick}
                >
                  Настройки
                </Link>
                <span
                  role="button"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  onClick={handleLogout}
                  aria-describedby="Выйти"
                >
                  Выйти
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/auth/sign-in"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  onClick={handleLinkClick}
                >
                  Войти
                </Link>
                <Link
                  to="/auth/sign-up"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  onClick={handleLinkClick}
                >
                  Создать аккаунт
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:gap-2 lg:gap-4">
        <ModeToggle />
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Открыть меню пользователя</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.first_name} {user?.last_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={"/settings/personal"}>Настройки</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              to="/auth/sign-in"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Войти
            </Link>
            <Link
              to="/auth/sign-up"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Создать аккаунт
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
