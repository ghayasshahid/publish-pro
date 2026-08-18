import { useAuth } from "../hooks/useAuth";

function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="header">
      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </header>
  );
}

export default LogoutButton;
