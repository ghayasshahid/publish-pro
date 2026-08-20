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
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5] p-[16px] box-border">
      <form
        className="bg-white p-[32px] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-full max-w-[400px] flex flex-col gap-[16px] box-border"
        onSubmit={handleFormSubmit}
      >
        <h1 className="m-0 text-[24px] text-center font-normal">Sign Up</h1>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="name" className="text-[14px] font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="p-[10px] border border-[#ccc] rounded-[4px] text-[14px] outline-none focus:outline-none focus:border-[#007bff] box-border"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-[10px] border border-[#ccc] rounded-[4px] text-[14px] outline-none focus:outline-none focus:border-[#007bff] box-border"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="confirmPassword" className="text-[14px] font-semibold">
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="p-[10px] border border-[#ccc] rounded-[4px] text-[14px] outline-none focus:outline-none focus:border-[#007bff] box-border"
            placeholder="Confirm your password"
            required
          />
        </div>

        {error && <p className="text-red-500 text-[14px] m-0">{error}</p>}

        <button
          type="submit"
          className="p-[12px] bg-[#007bff] text-white border-0 rounded-[4px] text-[16px] cursor-pointer disabled:bg-[#ccc] disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <div className="text-center">
          <Link
            to="/"
            className="text-[#007bff] text-[14px] no-underline hover:underline"
          >
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;