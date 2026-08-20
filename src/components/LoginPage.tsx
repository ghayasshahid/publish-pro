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
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
      );
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
    <div className="flex justify-center items-center min-h-screen bg-white p-[16px] box-border">
      <form
        className="bg-white p-[32px] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-full max-w-[400px] flex flex-col gap-[16px] box-border"
        onSubmit={handleLogin}
      >
        <h1 className="m-0 text-[24px] text-center font-normal">Login</h1>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="email" className="text-[14px] font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="p-[10px] border border-[#ccc] rounded-[4px] text-[14px] outline-none focus:outline-none focus:border-[#007bff] box-border"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="password" className="text-[14px] font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="p-[10px] border border-[#ccc] rounded-[4px] text-[14px] outline-none focus:outline-none focus:border-[#007bff] box-border"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-[14px] m-0">{error}</p>}

        <button
          type="submit"
          className="p-[12px] bg-[#007bff] !text-white border-0 rounded-[4px] text-[16px] cursor-pointer  transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <Link
            to="/signup"
            className="text-[#007bff] text-[14px] no-underline hover:underline"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;