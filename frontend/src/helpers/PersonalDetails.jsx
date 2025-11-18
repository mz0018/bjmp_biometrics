import { useEffect } from "react";
import { Pen, Check } from "lucide-react";
import usePersonalDetails from "../hooks/usePersonalDetails";
import { useNavigate } from "react-router-dom";

const PersonalDetails = ({ admin }) => {
  const {
    isGoogleAdmin,
    fields,
    disabled,
    setDisabled,
    formValues,
    handleChange,
    handleSubmit,
    loading,
    dirtyFields,
    forceLogout,
    errors,
  } = usePersonalDetails({ admin });

  const navigate = useNavigate();

  useEffect(() => {
    if (forceLogout) {
      const timer = setTimeout(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin", { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [forceLogout, navigate]);

  return (
    <section className="flex flex-col gap-6 mt-4 relative">
      <div
        className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-3xl ${
          isGoogleAdmin ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" autoComplete="off">
          {isGoogleAdmin && (
            <div className="col-span-2 text-sm text-gray-700 italic mb-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
              This account was created using Google sign-in. Some information cannot be edited.
            </div>
          )}

          {fields.map((item) => (
            <div key={item.id} className="col-span-2 md:col-span-1">
              <label htmlFor={item.id} className="text-sm font-medium text-gray-700">
                {item.title}
              </label>
              <input
                id={item.id}
                type="text"
                disabled={item.id === "userId" || isGoogleAdmin || disabled}
                value={formValues[item.id]}
                onChange={handleChange}
                className={`mt-1 w-full p-2 rounded-md text-sm border focus:outline-none focus:ring-2 pr-10 
                  ${errors[item.id] ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#002868]/60"} 
                  ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "text-[#002868]"}
                `}
              />
              {errors[item.id] && <p className="text-red-500 text-xs mt-1 capitalize">{errors[item.id]}</p>}
            </div>
          ))}

          <div className="flex justify-end col-span-2 mt-4 gap-2">
            {disabled ? (
              <button
                type="button"
                onClick={() => setDisabled(false)}
                className="bg-[#002868] text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-[#001b4d] flex items-center gap-2 transition cursor-pointer"
              >
                <Pen size={14} /> Edit Personal Information
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || disabled || Object.values(dirtyFields).every((v) => !v)}
                className="bg-[#002868] text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-[#001b4d] flex items-center gap-2 transition cursor-pointer"
                >
                <Check size={14} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>

      {forceLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-white text-lg font-semibold z-50">
          <div className="animate-spin mb-4 border-4 border-white border-t-transparent rounded-full w-12 h-12"></div>
          <p>Changes applied. Please log in again...</p>
        </div>
      )}
    </section>
  );
};

export default PersonalDetails;
