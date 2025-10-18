import { useState } from "react";
import useRegisterFace from "../hooks/useRegisterFace";
import TakenPictureFallback from "../fallback/TakenPictureFallbackj";
import SelectInmates from "../helpers/SelectInmates";
import { Trash2, Camera, CameraOff, Save, ArrowLeft, ArrowRight, User, Phone, MapPin, Venus, Mars } from "lucide-react";

const RegisterFace = () => {
  const [openCameraSection, setOpenCameraSection] = useState(false);
  const [isSelectInmateClicked, setIsSelectInmateClicked] = useState(false);

  const {
    isLoading,
    hasErrors,
    videoRef,
    canvasRef,
    capturedImages,
    startCamera,
    captureImage,
    saveImages,
    visitorName,
    setVisitorName,
    visitorAddress,
    setVisitorAddress,
    visitorContact,
    setVisitorContact,
    visitorGender,
    setVisitorGender,
    visitorListOfInmates,
    setVisitorListOfInmates,
    setCapturedImages
  } = useRegisterFace();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-start">
        Visitor Registration
      </h1>
      {!openCameraSection ? (
        <p className="text-gray-500">
          Please provide the required details to register a new visitor.
        </p>
      ) : (
        <p className="text-gray-500">
          Please ensure your camera has <span className="font-semibold">adequate lighting</span> and <span className="font-semibold">high resolution</span> for accurate face registration. Capture up to a <span className="font-semibold">maximum of five clear images</span> from <span className="font-semibold">different angles</span> for best recognition accuracy.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {!openCameraSection && (
          <div className="p-6 space-y-5">
            {/* Visitor Name */}
            <div>
              <label className="font-medium text-gray-700">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className={`w-full pl-10 px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 text-[#002868] placeholder-[#002868] ${
                    hasErrors.visitor_name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#002868]"
                  }`}
                />
              </div>
              {hasErrors.visitor_name && (
                <p className="text-red-500 text-sm mt-1">{hasErrors.visitor_name}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="font-medium text-gray-700">Contact</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. +63 912 345 6789"
                  value={visitorContact}
                  onChange={(e) => setVisitorContact(e.target.value)}
                  className={`w-full pl-10 px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 text-[#002868] placeholder-[#002868] ${
                    hasErrors.visitor_contact
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#002868]"
                  }`}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="font-medium text-gray-700">Gender</label>
              <div className="relative mt-1">
                {visitorGender === "Male" ? (
                  <Mars className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                ) : visitorGender === "Female" ? (
                  <Venus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                ) : (
                  <Mars className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                )}
                <select
                  value={visitorGender}
                  onChange={(e) => setVisitorGender(e.target.value)}
                  className={`w-full pl-10 px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 text-[#002868] ${
                    hasErrors.visitor_gender
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#002868]"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="font-medium text-gray-700">Address</label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. 123 Sampaguita St., Brgy. San Isidro, Quezon City"
                  value={visitorAddress}
                  onChange={(e) => setVisitorAddress(e.target.value)}
                  className={`w-full pl-10 px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 text-[#002868] placeholder-[#002868] ${
                    hasErrors.visitor_address
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#002868]"
                  }`}
                />
              </div>
            </div>

            {/* Inmates */}
            {/* <div>
              <label className="font-semibold mb-2 block">
                Inmates to Visit — relation to visitor
              </label>

              {visitorListOfInmates.map((inmate, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Inmate name (e.g. Juan Dela Cruz)"
                    value={inmate.inmate_name}
                    onChange={(e) => {
                      const updated = [...visitorListOfInmates];
                      updated[index].inmate_name = e.target.value;
                      setVisitorListOfInmates(updated);
                    }}
                    className="flex-1 border border-gray-300 rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-[#002868]"
                  />
                  <select
                    value={inmate.relationship}
                    onChange={(e) => {
                      const updated = [...visitorListOfInmates];
                      updated[index].relationship = e.target.value;
                      setVisitorListOfInmates(updated);
                    }}
                    className="flex-1 border border-gray-300 rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-[#002868]"
                  >
                    <option value="">Select relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      setVisitorListOfInmates(
                        visitorListOfInmates.filter((_, i) => i !== index)
                      )
                    }
                    className="bg-red-500 text-white px-3 rounded-sm hover:bg-red-600 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="mt-2 bg-[#002868] text-white px-4 py-2 rounded-sm hover:bg-blue-900 flex items-center gap-2 cursor-pointer"
                onClick={() =>
                  setVisitorListOfInmates([
                    ...visitorListOfInmates,
                    { inmate_name: "", relationship: "" },
                  ])
                }
              >
                <PlusCircle size={18} />
                <span>Add Inmate</span>
              </button>
            </div> */}
            <SelectInmates setIsSelectInmateClicked={setIsSelectInmateClicked} isSelectInmateClicked={isSelectInmateClicked} />

            {/* Next Step */}
            <p className="text-gray-600 text-sm mt-4">
              Make sure all fields are filled before proceeding to the{" "}
              <a
                href="#"
                className="font-semibold text-[#002868] inline-flex items-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenCameraSection(true);
                }}
              >
                Face Recognition step
                <ArrowRight size={14} />
              </a>
              .
            </p>
          </div>
        )}

        {openCameraSection && (
          <div className="col-span-2 w-full py-6 space-y-5">
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Face Recognition Step</h2>

            {/* Camera Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left – Camera */}
              <div className="flex-[1] space-y-4">
                <div className="relative w-full h-[50vh] rounded-sm border-gray-500 overflow-hidden">
                  {/* Fallback Image */}
                  <img
                    src="/img/cam.webp"
                    alt="Camera not active"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    style={{ filter: "grayscale(0.8)" }}
                  />

                  {/* Video (will cover image once started) */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  ></video>
                </div>

                <canvas
                  ref={canvasRef}
                  width="320"
                  height="240"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="flex gap-3 mt-2 justify-center md:justify-start">
                  <button
                    onClick={startCamera}
                    className="flex-1 bg-[#002868] text-white h-10 rounded-sm hover:bg-blue-900 flex items-center justify-center gap-2"
                  >
                    <Camera size={18} />
                    Start
                  </button>

                  <button
                    onClick={captureImage}
                    className="flex-1 bg-red-500 text-white h-10 rounded-sm hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <CameraOff size={18} />
                    Capture
                  </button>

                  <button
                    onClick={saveImages}
                    disabled={capturedImages.length === 0 || isLoading}
                    className={`flex-1 h-10 rounded-sm flex items-center justify-center gap-2 text-white ${
                      isLoading
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    <Save size={18} />
                    {isLoading ? "Loading..." : "Register"}
                  </button>
                </div>
              </div>

              {/* Right – Captured Images */}
              <TakenPictureFallback
                capturedImages={capturedImages}
                setCapturedImages={setCapturedImages}
              />
            </div>

            <a
              href="#"
              className="font-semibold text-[#002868] inline-flex items-center gap-1"
              onClick={(e) => {
                e.preventDefault();
                setOpenCameraSection(false);
              }}
            >
              <ArrowLeft size={18} />
              Go back and double-check your entered credentials.
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterFace;
