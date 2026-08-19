import { useAuth } from "../hooks/useAuth";

function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="p-4 flex justify-end">
      <div className="container">
        <button 
          onClick={logout} 
          className="px-4 py-2 bg-red-600 text-white border-none rounded cursor-pointer text-sm hover:bg-red-700 m-2.5"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default LogoutButton;
