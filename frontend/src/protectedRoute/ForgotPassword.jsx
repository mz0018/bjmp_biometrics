import { useState } from "react";
import { Mail, Send } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: "" });
  const [status, setStatus] = useState({ loading: false, message: "", error: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ loading: false, message: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = form;

    if (!email.trim()) {
      setStatus({ ...status, error: "Please enter your email address." });
      return;
    }

    try {
      setStatus({ loading: true, message: "", error: "" });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/forgot-password`,
        { email }
      );

      setStatus({
        loading: false,
        message:
          response.data?.message ||
          "If an account exists for that email, a reset link has been sent.",
        error: "",
      });

      setForm({ email: "" });
    } catch (err) {
      console.error(err);
      setStatus({
        loading: false,
        message: "",
        error:
          err.response?.data?.error ||
          "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <article className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-md">
        <header className="flex items-center gap-2 mb-4">
          <Mail size={18} className="text-[#002868]" aria-hidden="true" />
          <h1 className="text-lg font-semibold text-gray-800">Reset Password</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              aria-describedby={status.error ? "email-error" : "email-help"}
              placeholder="Enter your email"
              className={`p-2 border rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                status.error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-[#002868]/60"
              }`}
            />

            {!status.error && (
              <small id="email-help" className="text-[10px] text-gray-500 mt-0">
                We’ll send a reset link to this email address.
              </small>
            )}

            {status.error && (
              <small id="email-error" className="text-xs text-red-600 mt-0.5">
                {status.error}
              </small>
            )}
          </div>

          {status.message && (
            <p className="text-sm text-green-600" role="status">
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className={`bg-[#002868] text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-[#001b4d] transition-colors flex items-center justify-center gap-2 w-full ${
              status.loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <Send size={14} aria-hidden="true" />
            {status.loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <nav className="mt-4 text-center">
          <a
            href="/"
            className="text-xs text-[#002868] hover:font-semibold tracking-widest transition"
          >
            ← Back to login
          </a>
        </nav>
      </article>
    </main>
  );
};

export default ForgotPassword;
