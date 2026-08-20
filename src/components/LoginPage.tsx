import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { validateEmail, validatePassword } from "../utils/validation";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";

interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      login(response.data.accessToken);
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5] p-4">
      <form
        className="bg-white p-8 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-full max-w-[400px] flex flex-col gap-4"
        onSubmit={handleLogin}
      >
        <h1 className="m-0 text-2xl text-center font-semibold">Login</h1>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="p-[10px] border border-[#ccc] rounded text-[14px] focus:outline-none focus:border-[#007bff]"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="p-[10px] border border-[#ccc] rounded text-[14px] focus:outline-none focus:border-[#007bff]"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-[14px]">{error}</p>}

        <button
          type="submit"
          className="p-[12px] bg-[#007bff] text-white border-none rounded text-[16px] cursor-pointer disabled:bg-[#ccc] disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <nav>
            <Link to="/signup" className="text-[#007bff] text-[14px] hover:underline">
              Sign Up
            </Link>
          </nav>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
