import { useVerifyMutation } from "@/redux/features/authApiSlice";
import { finishInitialLoading, signIn } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./ThemeProvider";

export default function Setup() {
  const dispatch = useAppDispatch();

  const [verify] = useVerifyMutation();

  const { theme } = useTheme();

  const [toastTheme, setToastTheme] = useState("");

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setToastTheme(systemTheme);
      return;
    }
    setToastTheme(theme);
  }, [theme]);

  useEffect(() => {
    verify()
      .unwrap()
      .then(() => {
        dispatch(signIn());
      })
      .catch(() => {})
      .finally(() => {
        dispatch(finishInitialLoading());
      });
  }, [dispatch, verify]);

  return <ToastContainer theme={toastTheme} />;
}
