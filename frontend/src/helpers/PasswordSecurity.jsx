import { useState } from "react";
import { Eye, EyeOff, Lock, Pen } from "lucide-react";

const PasswordSecurity = ({ admin }) => {
  console.table(admin);
  const [visible, setVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (key) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const inputs = [
    {
      id: "current-password",
      key: "current",
      label: "Current password",
      placeholder: "Enter your existing password",
      helper: "Used to verify your identity before changing it.",
    },
    {
      id: "new-password",
      key: "new",
      label: "New password",
      placeholder: "Create a strong new password",
      helper: "At least 8 characters with a mix of numbers and symbols.",
    },
    {
      id: "confirm-password",
      key: "confirm",
      label: "Re-type password",
      placeholder: "Re-enter your new password",
      helper: "Must match the new password above.",
    },
  ];

  return (
    <section
      className="flex flex-col gap-6 mt-4"
      aria-labelledby="password-section-title"
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-3xl">
        <form className="grid grid-cols-2 gap-4" autoComplete="off">
          <h2
            id="password-section-title"
            className="col-span-2 text-lg font-semibold text-gray-800 flex items-center gap-2"
          >
            <Lock size={18} className="text-[#002868]" />
            Change Password
          </h2>

          {inputs.map((input) => (
            <div key={input.id} className="col-span-2 md:col-span-1">
              <label
                htmlFor={input.id}
                className="text-sm font-medium text-gray-700"
              >
                {input.label}
              </label>

              <div className="relative mt-1">
                <input
                  type={visible[input.key] ? "text" : "password"}
                  id={input.id}
                  name={input.id}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm text-[#002868] placeholder-[#002868] focus:outline-none focus:ring-2 focus:ring-[#002868]/60 pr-10"
                  placeholder={input.placeholder}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(input.key)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#002868] hover:text-[#001b4d]"
                  aria-label={`Toggle visibility for ${input.label}`}
                >
                  {visible[input.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <small className="text-xs text-gray-500 mt-1 block">
                {input.helper}
              </small>
            </div>
          ))}

          <div className="col-span-2 flex items-center justify-between mt-4">
            <a
              href="/forgot-password"
              className="text-xs text-[#002868] hover:font-semibold flex items-center gap-1 tracking-widest transition"
            >
              Forgot your password?
            </a>

            <button
              type="submit"
              className="bg-[#002868] text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-[#001b4d] transition-colors flex items-center gap-2"
            >
              <Pen size={14} className="text-white" />
              Change Password
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PasswordSecurity;
