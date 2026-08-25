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
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      login(response.data.accessToken, response.data.user);
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100 p-4 box-border">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4 box-border"
        onSubmit={handleLogin}
      >
        <h1 className="m-0 text-2xl text-center font-normal text-gray-900">
          Login
        </h1>
        
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-800"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-600 box-border"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-gray-800"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-600 box-border"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm m-0">{error}</p>}

        <button
          type="submit"
          className="p-3 bg-blue-600 text-white border-0 rounded text-base cursor-pointer hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <Link
            to="/signup"
            className="text-blue-600 text-sm no-underline hover:underline"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
