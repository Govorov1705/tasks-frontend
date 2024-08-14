import Home from "@/pages/Home";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import { useAppSelector } from "./redux/hooks";

const SignUp = lazy(() => import("./pages/SignUp"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Activation = lazy(() => import("./pages/Activation"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ResetPasswordConfirm = lazy(() => import("./pages/ResetPasswordConfirm"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SettingsPersonal = lazy(() => import("./pages/SettingsPersonal"));
const SettingsSecurity = lazy(() => import("./pages/SettingsSecurity"));
const ResetEmailConfirm = lazy(() => import("./pages/ResetEmailConfirm"));

export default function App() {
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isLoading) {
    return <Spinner lg center />;
  }

  return (
    <Suspense fallback={<Spinner lg center />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/tasks"
          element={
            isAuthenticated ? (
              <Tasks />
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        />
        <Route
          path="/auth/sign-in"
          element={!isAuthenticated ? <SignIn /> : <Navigate to="/" replace />}
        />
        <Route
          path="/auth/sign-up"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" replace />}
        />
        <Route
          path="/auth/activation/:uid/:token"
          element={
            !isAuthenticated ? <Activation /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            !isAuthenticated ? <ResetPassword /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/auth/reset-password/:uid/:token"
          element={<ResetPasswordConfirm />}
        />
        <Route
          path="/settings/personal"
          element={
            isAuthenticated ? (
              <SettingsPersonal />
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        />
        <Route
          path="/settings/security"
          element={
            isAuthenticated ? (
              <SettingsSecurity />
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        />
        <Route
          path="/auth/reset-email/:uid/:token"
          element={
            isAuthenticated ? (
              <ResetEmailConfirm />
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
