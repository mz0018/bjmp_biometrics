import { Eye, EyeOff, Lock, Pen } from "lucide-react";
import usePasswordSecurity from "../hooks/usePasswordSecurity";

const PasswordSecurity = ({ admin }) => {
  const {
    data,
    visible,
    loading,
    fieldErrors,
    inputs,
    handleChange,
    toggleVisibility,
    handleSubmit,
  } = usePasswordSecurity({ admin });

  const isGoogleAdmin = !!admin.googleId;

  console.table(admin.googleId);

  return (
    <section
      className="flex flex-col gap-6 mt-4"
      aria-labelledby="password-section-title"
    >
      <div
        className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-3xl ${
          isGoogleAdmin ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
          autoComplete="off"
        >
          <h2
            id="password-section-title"
            className="col-span-2 text-lg font-semibold text-gray-800 flex items-center gap-2"
          >
            <Lock size={18} className="text-[#002868]" />
            Change Password
          </h2>

          {isGoogleAdmin && (
            <div className="col-span-2 text-sm text-gray-700 italic mb-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
              This account was created using Google sign-in. Password changes are only available for accounts
              created manually with email and password.
            </div>
          )}

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
                  name={input.name}
                  value={data[input.name]}
                  onChange={handleChange}
                  disabled={isGoogleAdmin}
                  className={`border p-2 rounded-md w-full text-sm placeholder-[#002868] focus:outline-none focus:ring-2 pr-10
                    ${
                      fieldErrors[input.name]
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 text-[#002868] focus:ring-[#002868]/60"
                    }`}
                  placeholder={input.placeholder}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(input.key)}
                  disabled={isGoogleAdmin}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                    fieldErrors[input.name]
                      ? "text-red-500 hover:text-red-700"
                      : "text-[#002868] hover:text-[#001b4d]"
                  }`}
                  aria-label={`Toggle visibility for ${input.label}`}
                >
                  {visible[input.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {fieldErrors[input.name] ? (
                <small className="text-xs text-red-600 mt-1 block">
                  {fieldErrors[input.name]}
                </small>
              ) : (
                <small className="text-xs text-gray-500 mt-1 block">
                  {input.helper}
                </small>
              )}
            </div>
          ))}

          {fieldErrors.general && (
            <p className="col-span-2 text-sm text-red-600 mt-2">
              {fieldErrors.general}
            </p>
          )}

          <div className="col-span-2 flex items-center justify-between mt-4">
            <a
              href="/forgot-password"
              rel="noopener noreferrer"
              className="text-xs text-[#002868] hover:font-semibold flex items-center gap-1 tracking-widest transition"
            >
              Forgot your password?
            </a>

            <button
              type="submit"
              disabled={loading || isGoogleAdmin}
              className={`bg-[#002868] text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-[#001b4d] transition-colors flex items-center gap-2 ${
                loading || isGoogleAdmin ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <Pen size={14} className="text-white" />
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PasswordSecurity;
