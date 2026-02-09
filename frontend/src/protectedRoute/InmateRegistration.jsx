import { useState, useEffect } from "react";
import useInmateRegistration from "../hooks/useInmateRegistration";

import {
  genderOptions,
  nationalityOptions,
  civilStatusOptions,
  offenseOptions,
  statusOptions,
} from "../helpers/mockData";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// --------------------------
// Reusable Input
// --------------------------

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder = "",
  disabled = false,
  helper,
  required = false,
  className = "",
}) => {
  const baseClasses = `border rounded-md focus:outline-none focus:ring-2 text-[#002868] placeholder-[#A0AEC0] p-2 w-full text-sm`;
  const errorClasses = error
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-[#002868]";
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white";

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="font-semibold text-sm text-gray-700 tracking-wide flex justify-between"
      >
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
        aria-invalid={!!error}
        aria-required={required}
      />
      {error && <p className="text-red-600 text-xs">{error}</p>}
      {helper && !error && <p className="text-gray-500 text-xs">{helper}</p>}
    </div>
  );
};

// --------------------------
// Reusable Select
// --------------------------

const SelectField = ({
  label,
  name,
  value,
  onChange,
  error,
  options,
  helper,
  required = false,
}) => {
  const baseClasses = `border rounded-md focus:outline-none focus:ring-2 text-[#002868] p-2 w-full text-sm`;
  const errorClasses = error
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-[#002868]";

  return (
    <div className="space-y-1">
      <label className="font-semibold text-sm text-gray-700 tracking-wide flex justify-between">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${errorClasses} bg-white`}
        aria-invalid={!!error}
        aria-required={required}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      {helper && !error && <p className="text-gray-500 text-xs">{helper}</p>}
    </div>
  );
};

// --------------------------
// Mugshot Uploader
// --------------------------

const MugshotUploader = ({ preview, onClick, onChange, id }) => (
  <div className="flex flex-col items-center space-y-1">
    <label
      htmlFor={id}
      className="w-28 h-28 border border-gray-400 bg-gray-100
      flex items-center justify-center cursor-pointer overflow-hidden"
    >
      {preview ? (
        <img
          src={preview}
          alt={`${id} preview`}
          onClick={onClick}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-500 text-xs">Upload</span>
      )}
    </label>

    <input
      id={id}
      type="file"
      accept="image/*"
      name={id}
      onChange={onChange}
      className="hidden"
    />
  </div>
);

// --------------------------
// Main Component
// --------------------------

const InmateRegistration = () => {
  const { handleInmateRegistration, formData, handleChange, loading, hasError } =
    useInmateRegistration();

  const [previews, setPreviews] = useState({
    mugshot_front: null,
    mugshot_left: null,
    mugshot_right: null,
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handleFile = (e) => {
    const { name, files } = e.target;
    if (!files[0]) return;

    handleChange(e);
    const url = URL.createObjectURL(files[0]);
    setPreviews((p) => ({ ...p, [name]: url }));
  };

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <section className="px-6 py-4 min-h-[100dvh] bg-gray-50">
      <form onSubmit={handleInmateRegistration} className="space-y-6">
        {/* ------------------ CASE INFO ------------------ */}
        {/* <div className="bg-white border border-gray-300 p-4">
          <h2 className="text-gray-700 font-bold text-sm mb-3 border-b pb-1 uppercase tracking-wide">
            Case Information
          </h2>

          <div className="grid md:grid-cols-4 gap-3">
            <InputField
              label="Case Number"
              name="caseNumber"
              value={formData.caseNumber || "Auto-generated"}
              onChange={handleChange}
              error={hasError.caseNumber}
              disabled
              helper="Generated on submission"
            />
            <InputField
              label="Court Name"
              name="courtName"
              value={formData.courtName}
              onChange={handleChange}
              error={hasError.courtName}
            />
            <InputField
              label="Arrest Date"
              name="arrestDate"
              type="date"
              value={formData.arrestDate}
              onChange={handleChange}
              error={hasError.arrestDate}
            />
            <InputField
              label="Commitment Date"
              name="commitmentDate"
              type="date"
              value={formData.commitmentDate}
              onChange={handleChange}
              error={hasError.commitmentDate}
            />
          </div>
        </div> */}

        {/* ------------------ PERSONAL INFO ------------------ */}
        <div className="bg-white border border-gray-300 p-4 space-y-4">
          <h2 className="text-gray-700 font-bold text-sm mb-1 border-b pb-1 uppercase tracking-wide">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-4 gap-3">
            <InputField label="Firstname" name="firstname" value={formData.firstname} onChange={handleChange} error={hasError.firstname} />
            <InputField label="Middle Initial" name="middleInitial" value={formData.middleInitial} onChange={handleChange} error={hasError.middleInitial} />
            <InputField label="Lastname" name="lastname" value={formData.lastname} onChange={handleChange} error={hasError.lastname} />
            <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} error={hasError.dateOfBirth} />
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={hasError.address}
              className="md:col-span-2"
            />
            <SelectField
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              error={hasError.nationality}
              options={nationalityOptions}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-3">
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={hasError.gender}
              options={genderOptions}
            />
            <SelectField
              label="Civil Status"
              name="civilStatus"
              value={formData.civilStatus}
              onChange={handleChange}
              error={hasError.civilStatus}
              options={civilStatusOptions}
            />
            <InputField
              label="Height (cm)"
              name="height"
              value={formData.height}
              onChange={handleChange}
              error={hasError.height}
            />
            <InputField
              label="Weight (kg)"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              error={hasError.weight}
            />
          </div>
        </div>

        {/* ------------------ OFFENSE ------------------ */}
        {/* <div className="bg-white border border-gray-300 p-4 space-y-3">
          <h2 className="text-gray-700 font-bold text-sm mb-1 border-b pb-1 uppercase tracking-wide">
            Offense & Legal Status
          </h2>

          <div className="grid md:grid-cols-3 gap-3">
            <SelectField
              label="Offense"
              name="offense"
              value={formData.offense}
              onChange={handleChange}
              error={hasError.offense}
              options={offenseOptions}
            />
            <InputField
              label="Sentence"
              name="sentence"
              value={formData.sentence}
              onChange={handleChange}
              error={hasError.sentence}
            />
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              error={hasError.status}
              options={statusOptions}
            />
            <InputField
              label="Remarks (Optional)"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              error={hasError.remarks}
              className="md:col-span-3"
            />
          </div>
        </div> */}

        {/* ------------------ MUGSHOTS ------------------ */}
        <div className="bg-white border border-gray-300 p-4">
          <h2 className="text-gray-700 font-bold text-sm mb-3 border-b pb-1 uppercase tracking-wide">
            Mugshots
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {["mugshot_front", "mugshot_left", "mugshot_right"].map((key) => (
              <MugshotUploader
                key={key}
                id={key}
                preview={previews[key]}
                onChange={handleFile}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImage(previews[key]);
                  setLightboxOpen(true);
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end items-center mt-4 gap-1">
          <button
            onClick={() => window.history.back()}
            className="border border-gray-300 px-6 text-gray-600 py-3 rounded-md text-sm tracking-wider hover:bg-gray-100 transition font-semibold cursor-pointer"
          >
            Go Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#002868] text-white px-6 py-3 rounded-md text-sm tracking-wider hover:bg-blue-900 transition cursor-pointer"
          >
            {loading ? "Processing..." : "Register Inmate"}
          </button>
        </div>
      </form>

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: currentImage }]}
        />
      )}
    </section>
  );
};

export default InmateRegistration;
