import { useAuth } from "../hooks/useAuth";

function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="max-w-6xl mx-auto px-6 pt-4 flex justify-end box-border">
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white border-0 rounded cursor-pointer text-sm font-medium hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </header>
  );
}

export default LogoutButton;