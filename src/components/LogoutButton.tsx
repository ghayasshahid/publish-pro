import { useAuth } from "../hooks/useAuth";

function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="p-[16px] flex justify-end box-border">
      <button
        onClick={logout}
        className="px-[16px] py-[8px] bg-[#dc3545] text-white border-0 rounded-[4px] cursor-pointer text-[14px] font-medium hover:bg-[#bd2130] transition-colors"
      >
        Logout
      </button>
    </header>
  );
}

export default LogoutButton;