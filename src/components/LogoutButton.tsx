import { useAuth } from "../hooks/useAuth";

function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <button onClick={logout} className="logout-btn">
      Logout
    </button>
  );
}

export default LogoutButton;
