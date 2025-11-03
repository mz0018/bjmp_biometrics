import { useState } from "react";
import useInmateRegistration from "../hooks/useInmateRegistration";
import {
  genderOptions,
  nationalityOptions,
  civilStatusOptions,
  offenseOptions,
  statusOptions,
} from "../helpers/mockData";
import {
  User,
  Calendar,
  MapPin,
  Clipboard,
  FileText,
  Image as ImageIcon,
  Mars,
  Venus,
} from "lucide-react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const InmateRegistration = () => {
  const {
    handleInmateRegistration,
    formData,
    handleChange,
    loading,
    hasError,
  } = useInmateRegistration();

  const [previewImages, setPreviewImages] = useState({
    mugshot_front: null,
    mugshot_left: null,
    mugshot_right: null,
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  
  const getInputClass = (name) =>
    `border p-2 rounded w-full text-sm focus:outline-none focus:ring-2 text-[#002868] placeholder-[#002868] ${
      hasError[name] ? "border-red-500 focus:ring-red-300" : "border-gray-300"
    }`;

  const renderError = (name) =>
    hasError[name] && (
      <p className="text-red-500 text-xs mt-1 capitalize">{hasError[name]}</p>
    );

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      handleChange(e);

      const previewUrl = URL.createObjectURL(files[0]);
      setPreviewImages((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <section className="p-6 min-h-[100dvh] flex flex-col overflow-hidden">
      <form
        onSubmit={handleInmateRegistration}
        encType="multipart/form-data"
        className="space-y-5"
      >

        <div className="mb-2 rounded-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="font-medium text-gray-700">Case Number</label>
              <div className="relative mt-1">
                <FileText
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("caseNumber")} pl-10 bg-gray-100 cursor-not-allowed`}
                  name="caseNumber"
                  value={formData.caseNumber || "Auto-generated"}
                  onChange={handleChange}
                  placeholder="Case Number"
                  disabled
                />
              </div>
              {renderError("caseNumber")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Court Name</label>
              <div className="relative mt-1">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("courtName")} pl-10`}
                  name="courtName"
                  value={formData.courtName}
                  onChange={handleChange}
                  placeholder="e.g., Regional Trial Court or Municipal Trial Court"
                />
              </div>
              {renderError("courtName")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Arrest Date</label>
              <div className="relative mt-1">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("arrestDate")} pl-10`}
                  name="arrestDate"
                  type="date"
                  value={formData.arrestDate}
                  onChange={handleChange}
                />
              </div>
              {renderError("arrestDate")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Commitment Date</label>
              <div className="relative mt-1">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("commitmentDate")} pl-10`}
                  name="commitmentDate"
                  type="date"
                  value={formData.commitmentDate}
                  onChange={handleChange}
                />
              </div>
              {renderError("commitmentDate")}
            </div>
          </div>
        </div>

        {/* Personal info box */}
        <div className="mb-2 rounded-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="font-medium text-gray-700">Firstname</label>
              <div className="relative mt-1">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("firstname")} pl-10`}
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Firstname"
                />
              </div>
              {renderError("firstname")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Middle Initial</label>
              <div className="relative mt-1">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("middleInitial")} pl-10`}
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                  placeholder="Middle Initial"
                />
              </div>
              {renderError("middleInitial")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Lastname</label>
              <div className="relative mt-1">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("lastname")} pl-10`}
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Lastname"
                />
              </div>
              {renderError("lastname")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Date of Birth</label>
              <div className="relative mt-1">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("dateOfBirth")} pl-10`}
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              {renderError("dateOfBirth")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="md:col-span-2">
              <label className="font-medium text-gray-700">Address</label>
              <div className="relative mt-1">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("address")} pl-10`}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Sampaguita St., Brgy. San Isidro, Quezon City"
                />
              </div>
              {renderError("address")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Nationality</label>
              <div className="relative mt-1">
                <Clipboard
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  className={`${getInputClass("nationality")} pl-10`}
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                >
                  <option value="">Select Nationality</option>
                  {nationalityOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {renderError("nationality")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
            <div>
              <label className="font-medium text-gray-700">Gender</label>
              <div className="relative mt-1">
                {formData.gender === "Male" ? (
                  <Mars
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                ) : formData.gender === "Female" ? (
                  <Venus
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                ) : (
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    size={18}
                  />
                )}
                <select
                  className={`${getInputClass("gender")} pl-10`}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {renderError("gender")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Civil Status</label>
              <div className="relative mt-1">
                <Clipboard
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  className={`${getInputClass("civilStatus")} pl-10`}
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                >
                  <option value="">Select Civil Status</option>
                  {civilStatusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {renderError("civilStatus")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Height</label>
              <div className="relative mt-1">
                <FileText
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("height")} pl-10`}
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height"
                />
              </div>
              {renderError("height")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Weight</label>
              <div className="relative mt-1">
                <FileText
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("weight")} pl-10`}
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight"
                />
              </div>
              {renderError("weight")}
            </div>
          </div>
        </div>

        {/* Offense & sentence box */}
        <div className="mb-2 rounded-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-medium text-gray-700">Offense</label>
              <div className="relative mt-1">
                <Clipboard
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  className={`${getInputClass("offense")} pl-10`}
                  name="offense"
                  value={formData.offense}
                  onChange={handleChange}
                >
                  <option value="">Select Offense</option>
                  {offenseOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {renderError("offense")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Sentence</label>
              <div className="relative mt-1">
                <FileText
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className={`${getInputClass("sentence")} pl-10`}
                  name="sentence"
                  value={formData.sentence}
                  onChange={handleChange}
                  placeholder="Sentence"
                />
              </div>
              {renderError("sentence")}
            </div>

            <div>
              <label className="font-medium text-gray-700">Status</label>
              <div className="relative mt-1">
                <Clipboard
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  className={`${getInputClass("status")} pl-10`}
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {renderError("status")}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-700">Remarks <span className="text-xs text-gray-500">(Optional)</span></label>
              
            </div>

            <div className="relative mt-1">
              <Clipboard
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                className={`${getInputClass("remarks")} pl-10`}
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Remarks"
              />
            </div>

            {renderError("remarks")}
          </div>
        </div>

        {/* Mugshots — only your three inputs + preview */}
        <div className="mb-2 rounded-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["mugshot_front", "mugshot_left", "mugshot_right"].map((side) => (
              <div key={side}>
                <label className="text-xs text-gray-600 capitalize block mb-1">
                  {side.replace("mugshot_", "")} view
                </label>
                <div className="relative mt-1 flex flex-col gap-2">
                  <div className="relative">
                    <ImageIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      className={`${getInputClass(side)} pl-10`}
                      type="file"
                      name={side}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* ✅ Thumbnail Preview */}
                  {previewImages[side] && (
                    <img
                      src={previewImages[side]}
                      alt={`${side} preview`}
                      className="w-32 h-32 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => {
                        setCurrentImage(previewImages[side]);
                        setLightboxOpen(true);
                      }}
                    />
                  )}
                </div>
                {renderError(side)}
              </div>
            ))}
          </div>
        </div>

        {/* General error */}
        {hasError.general && (
          <p className="text-red-500 text-center mt-4 mb-2 capitalize">{hasError.general}</p>
        )}

        <button
          disabled={loading}
          type="submit"
          className="mt-2 bg-[#002868] text-white px-4 py-2 rounded-sm hover:bg-blue-900 flex items-center gap-2 cursor-pointer"
        >
          {loading ? "Registering..." : "Register Inmate"}
        </button>
      </form>

      {lightboxOpen && (
        <Lightbox
          mainSrc={currentImage}
          onCloseRequest={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
};

export default InmateRegistration;
