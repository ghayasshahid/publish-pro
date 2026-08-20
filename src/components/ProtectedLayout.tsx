import { Outlet } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function ProtectedLayout() {
  return (
    <>
      <LogoutButton />
      <Outlet />
    </>
  );
}
