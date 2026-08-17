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
    <>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-form__container">
          <h1 className="login-form__title">Login</h1>

          <div className="login-form__input-container">
            <label className="login-form__label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="login-form__input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-form__input-container">
            <label className="login-form__label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="login-form__input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <button
            type="submit"
            className="login-form__submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="login-form__links">
            <nav>
              <Link to="/signup" className="login-form__link">
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </form>
    </>
  );
}

export default LoginPage;
