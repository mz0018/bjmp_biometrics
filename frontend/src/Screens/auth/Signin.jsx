import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import useSigninAdmin from "../../hooks/useSigninAdmin";

const InputField = ({
  id,
  type,
  name,
  value,
  onChange,
  placeholder,
  Icon,
  showPassword,
  togglePassword,
  error,
}) => (
  <div className="flex flex-col space-y-2 relative">
    <label htmlFor={id} className="font-medium text-gray-700">
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        id={id}
        type={type === "password" && showPassword ? "text" : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : "username"}
        className={`w-full pl-10 px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 text-[#002868] placeholder-[#002868] ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#002868]"
        }`}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  </div>
);

const Signin = () => {
  const { formData, handleChange, handleSubmit, isLoading, errors } = useSigninAdmin();
  const [showPassword, setShowPassword] = useState(false);

  const notyf = new Notyf({ duration: 3000, position: { x: "right", y: "top" } });

  useEffect(() => {
    Object.values(errors).forEach((err) => err && notyf.error(err));
  }, [errors]);

  return (
    <section className="w-full max-w-xl text-center mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002868] mb-2">
        Sign in to continue
      </h1>
      <p className="mb-4 text-sm text-[#002868]">
        Enter your credentials to access your account
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 text-left w-full">
        <InputField
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="john@example.com or username"
          Icon={User}
          error={errors.username || errors.password}
        />

        <InputField
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          Icon={Lock}
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          error={errors.password || errors.username}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-sm font-medium text-white bg-[#BF0A30] hover:bg-[#990820] transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
};

export default Signin;
