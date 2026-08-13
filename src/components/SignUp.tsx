import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setConfirmPassword(value);
    if (password !== value) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        "https://riot-reacquire-unstylish.ngrok-free.dev/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form className="login-form" onSubmit={handleFormSubmit}>
        <div className="login-form__container">
          <h1 className="login-form__title">Sign Up</h1>
          <div className="login-form__input-container">
            <label htmlFor="name" className="login-form__label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="login-form__input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="login-form__input-container">
            <label htmlFor="email" className="login-form__label">
              Email
            </label>
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
            <label htmlFor="password" className="login-form__label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-form__input"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="login-form__input-container">
            <label htmlFor="confirmPassword" className="login-form__label">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="login-form__input"
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="login-form__submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <div className="login-form__links">
            <Link to="/" className="login-form__link">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

export default SignUp;
