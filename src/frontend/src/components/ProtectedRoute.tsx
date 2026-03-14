import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate({ to: "/admin/login" });
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
