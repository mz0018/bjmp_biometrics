import { useState, useEffect, useRef } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import useSignupAdmin from "../../hooks/useSignupAdmin";

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
      {name.charAt(0).toUpperCase() + name.slice(1).replace("_", " ")}
    </label>
    <div className="relative">
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        id={id}
        type={type === "password" && showPassword ? "text" : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : "username"}
        className={`w-full pl-10 px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 text-[#002868] placeholder-[#002868] ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-[#002868]"
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

const Signup = () => {
  const { formData, handleChange, handleSubmit, isLoading, errors } =
    useSignupAdmin();
  const [showPassword, setShowPassword] = useState(false);

  const notyf = useRef(
    new Notyf({ duration: 3000, position: { x: "right", y: "top" } })
  );
  const prevErrors = useRef({});

  useEffect(() => {
    Object.entries(errors).forEach(([key, err]) => {
      if (err && err !== prevErrors.current[key]) {
        notyf.current.error(err);
      }
    });
    prevErrors.current = errors;
  }, [errors]);

  return (
    <section className="w-full max-w-xl text-center mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002868] mb-2">
        Signup Admin
      </h1>
      <p className="mb-4 text-sm text-[#002868]">
        Enter your details to create an account
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 text-left w-full"
      >
        {/* First & Last Name side by side */}
        <div className="flex gap-4">
          <div className="flex-1">
            <InputField
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="John"
              Icon={User}
              error={errors.first_name}
            />
          </div>
          <div className="flex-1">
            <InputField
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Doe"
              Icon={User}
              error={errors.last_name}
            />
          </div>
        </div>

        {/* Username */}
        <InputField
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="john@example.com"
          Icon={User}
          error={errors.username}
        />

        {/* Password */}
        <InputField
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          Icon={Lock}
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          error={errors.password}
        />

        {/* Retype Password */}
        <InputField
          id="retype_password"
          type="password"
          name="retype_password"
          value={formData.retype_password}
          onChange={handleChange}
          placeholder="Confirm your password"
          Icon={Lock}
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          error={errors.retype_password}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-sm font-medium text-white bg-[#BF0A30] hover:bg-[#990820] transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {isLoading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </section>
  );
};

export default Signup;
