import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";
import { api } from "../api";

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
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/auth/register", { name, email, password });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100 p-4 box-border">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4 box-border"
        onSubmit={handleFormSubmit}
      >
        <h1 className="m-0 text-2xl text-center font-normal text-gray-900">Sign Up</h1>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-gray-800">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-600 box-border"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-gray-800">
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
          <label htmlFor="password" className="text-sm font-semibold text-gray-800">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-600 box-border"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-600 box-border"
            placeholder="Confirm your password"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm m-0">{error}</p>}

        <button
          type="submit"
          className="p-3 bg-blue-600 text-white border-0 rounded text-base cursor-pointer hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <div className="text-center">
          <Link
            to="/"
            className="text-blue-600 text-sm no-underline hover:underline"
          >
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;