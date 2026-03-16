import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);
  if (localStorage.getItem("isAdminLoggedIn") !== "true") return null;
  return <>{children}</>;
}
