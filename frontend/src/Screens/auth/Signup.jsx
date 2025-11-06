import { useState, useEffect, useRef } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import useSignupAdmin from "../../hooks/useSignupAdmin";

const calculateStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[\W_]/.test(password)) score++;
  return score;
};

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
  passwordStrength,
}) => {
  const strengthLabels = ["Too Weak", "Weak", "Medium", "Strong", "Very Strong"];
  const strengthColors = ["#FF4B4B", "#FF6B6B", "#F6C23E", "#4CAF50", "#2E7D32"];

  const requirements = [
    { label: "At least 8 characters", valid: value.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(value) },
    { label: "Contains number", valid: /[0-9]/.test(value) },
    { label: "Contains special character", valid: /[\W_]/.test(value) },
  ];

  return (
    <div className="flex flex-col space-y-2 relative">
      <label htmlFor={id} className="font-medium text-gray-700 capitalize">
        {name.replace("_", " ").toLowerCase()}
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
          className={`w-full pl-10 px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 text-[#002868] placeholder-[#002868] ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#002868]"}`}
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

      {name === "password" && value && (
        <div className="mt-1 flex flex-col gap-1">
          {requirements.map((req, index) => (
            <p key={index} className={`text-sm flex items-center gap-1 ${req.valid ? "text-green-600" : "text-gray-500"}`}>
              {req.valid ? "✔" : "❌"} {req.label}
            </p>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <div className="h-2 flex-1 rounded-sm" style={{ backgroundColor: strengthColors[passwordStrength] }}></div>
            <span className="text-sm font-medium" style={{ color: strengthColors[passwordStrength] }}>
              {strengthLabels[passwordStrength]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const Signup = ({ setIsSignupOpen }) => {
  const { formData, handleChange, handleSubmit, isLoading, errors } = useSignupAdmin(setIsSignupOpen);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const notyf = useRef(new Notyf({ duration: 5000, position: { x: "right", y: "top" } }));
  const shownErrors = useRef(new Set());

  useEffect(() => {
    Object.values(errors).forEach((err) => {
      if (err && !shownErrors.current.has(err)) {
        notyf.current.error(err);
        shownErrors.current.add(err);
      }
    });
  }, [errors]);

  useEffect(() => {
    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  return (
    <section className="w-full max-w-xl text-center mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002868] mb-2">Signup Admin</h1>
      <p className="mb-4 text-sm text-[#002868]">Enter your details to create an account</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 text-left w-full">
        <div className="flex gap-4">
          <div className="flex-1">
            <InputField id="first_name" type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" Icon={User} error={errors.first_name} />
          </div>
          <div className="flex-1">
            <InputField id="last_name" type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" Icon={User} error={errors.last_name} />
          </div>
        </div>

        <InputField id="username" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="john@example.com" Icon={User} error={errors.username} />

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
          passwordStrength={passwordStrength}
        />

        <InputField
          id="retype_password"
          type="password"
          name="retype_password"
          value={formData.retype_password}
          onChange={handleChange}
          placeholder="Confirm your password"
          Icon={Lock}
          showPassword={showRetypePassword}
          togglePassword={() => setShowRetypePassword(!showRetypePassword)}
          error={errors.retype_password}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-sm font-medium text-white bg-[#BF0A30] hover:bg-[#990820] transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
          {isLoading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </section>
  );
};

export default Signup;
