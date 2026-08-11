import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "./GlobalStateStore";

const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.token);
  if (!token) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
