import useInmateRegistration from "../hooks/useInmateRegistration";
import {
  genderOptions,
  nationalityOptions,
  civilStatusOptions,
  offenseOptions,
  statusOptions,
} from "../helpers/mockData";

const InmateRegistration = () => {
  const {
    handleInmateRegistration,
    formData,
    handleChange,
    loading,
    hasError,
  } = useInmateRegistration();

  const getInputClass = (name) =>
    `border p-2 rounded w-full ${
      hasError[name] ? "border-red-500 focus:ring-red-300" : "border-gray-300"
    }`;

  const renderError = (name) =>
    hasError[name] && (
      <p className="text-red-500 text-sm mt-1">{hasError[name]}</p>
    );

  const fields = [
    { name: "firstname", type: "text", placeholder: "Firstname" },
    { name: "middleInitial", type: "text", placeholder: "Middle Initial" },
    { name: "lastname", type: "text", placeholder: "Lastname" },
    { name: "dateOfBirth", type: "date", placeholder: "Date of Birth" },
    { name: "address", type: "text", placeholder: "Address" },
    { name: "height", type: "text", placeholder: "Height" },
    { name: "weight", type: "text", placeholder: "Weight" },
    { name: "caseNumber", type: "text", placeholder: "Case Number" },
    { name: "sentence", type: "text", placeholder: "Sentence" },
    { name: "courtName", type: "text", placeholder: "Court Name" },
    { name: "arrestDate", type: "date", placeholder: "Arrest Date" },
    { name: "commitmentDate", type: "date", placeholder: "Commitment Date" },
    { name: "remarks", type: "text", placeholder: "Remarks" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleInmateRegistration}
        encType="multipart/form-data"
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl pr-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Inmate Registration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Text Inputs */}
          {fields.map(({ name, type, placeholder }) => (
            <div key={name}>
              <input
                className={getInputClass(name)}
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={handleChange}
                value={formData[name]}
              />
              {renderError(name)}
            </div>
          ))}

          {/* Selects */}
          <div>
            <select
              className={getInputClass("gender")}
              name="gender"
              onChange={handleChange}
              value={formData.gender}
            >
              <option value="">Select Gender</option>
              {genderOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {renderError("gender")}
          </div>

          <div>
            <select
              className={getInputClass("nationality")}
              name="nationality"
              onChange={handleChange}
              value={formData.nationality}
            >
              <option value="">Select Nationality</option>
              {nationalityOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {renderError("nationality")}
          </div>

          <div>
            <select
              className={getInputClass("civilStatus")}
              name="civilStatus"
              onChange={handleChange}
              value={formData.civilStatus}
            >
              <option value="">Select Civil Status</option>
              {civilStatusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {renderError("civilStatus")}
          </div>

          <div>
            <select
              className={getInputClass("offense")}
              name="offense"
              onChange={handleChange}
              value={formData.offense}
            >
              <option value="">Select Offense</option>
              {offenseOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {renderError("offense")}
          </div>

          <div>
            <select
              className={getInputClass("status")}
              name="status"
              onChange={handleChange}
              value={formData.status}
            >
              <option value="">Select Status</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {renderError("status")}
          </div>
        </div>

        {/* Mugshots */}
        <div className="mt-6">
          <p className="font-medium text-gray-700 mb-2">
            Upload Mugshots (3 pictures)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {["mugshot_front", "mugshot_left", "mugshot_right"].map((side) => (
              <label key={side} className="flex flex-col items-start">
                <span className="text-sm text-gray-600 mb-1 capitalize">
                  {side.replace("mugshot_", "")} View
                </span>
                <input
                  className={getInputClass(side)}
                  type="file"
                  name={side}
                  accept="image/*"
                  onChange={handleChange}
                />
                {renderError(side)}
              </label>
            ))}
          </div>
        </div>

        {/* General Error */}
        {hasError.general && (
          <p className="text-red-500 text-center mt-4">{hasError.general}</p>
        )}

        <button
          disabled={loading}
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Registering..." : "Register Inmate"}
        </button>
      </form>
    </div>
  );
};

export default InmateRegistration;
