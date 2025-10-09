import { useState } from "react";
import useRegisterFace from "../hooks/useRegisterFace";

const RegisterFace = () => {
  const [openCameraSection, setOpenCameraSection] = useState(false);

  const {
    isLoading,
    hasErrors,
    videoRef,
    canvasRef,
    capturedImages,
    startCamera,
    captureImage,
    saveImages,
    admin,
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
  } = useRegisterFace();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-start">Register New Visitor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {!openCameraSection && (
          <>
            {/* LEFT COLUMN – FORM INPUTS */}
            <div className="p-6 space-y-4">
              {/* Visitor Name */}
              <input
                type="text"
                placeholder="Visitor's Name"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 ${
                  hasErrors.visitor_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {hasErrors.visitor_name && (
                <p className="text-red-500 text-sm">{hasErrors.visitor_name}</p>
              )}

              {/* Visitor Contact */}
              <input
                type="text"
                placeholder="Visitor's Contact"
                value={visitorContact}
                onChange={(e) => setVisitorContact(e.target.value)}
                className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 ${
                  hasErrors.visitor_contact ? "border-red-500" : "border-gray-300"
                }`}
              />

              {/* Gender */}
              <select
                value={visitorGender}
                onChange={(e) => setVisitorGender(e.target.value)}
                className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 ${
                  hasErrors.visitor_gender ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              {/* Address */}
              <input
                type="text"
                placeholder="Visitor's Address"
                value={visitorAddress}
                onChange={(e) => setVisitorAddress(e.target.value)}
                className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 ${
                  hasErrors.visitor_address ? "border-red-500" : "border-gray-300"
                }`}
              />

              {/* Inmates List */}
              <div>
                <label className="block font-semibold mb-2">Inmates to Visit</label>
                {visitorListOfInmates.map((inmate, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Inmate Name"
                      value={inmate.inmate_name}
                      onChange={(e) => {
                        const newList = [...visitorListOfInmates];
                        newList[index].inmate_name = e.target.value;
                        setVisitorListOfInmates(newList);
                      }}
                      className="flex-1 border p-2 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Relationship"
                      value={inmate.relationship}
                      onChange={(e) => {
                        const newList = [...visitorListOfInmates];
                        newList[index].relationship = e.target.value;
                        setVisitorListOfInmates(newList);
                      }}
                      className="flex-1 border p-2 rounded-lg"
                    />
                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600"
                      onClick={() =>
                        setVisitorListOfInmates(
                          visitorListOfInmates.filter((_, i) => i !== index)
                        )
                      }
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() =>
                    setVisitorListOfInmates([
                      ...visitorListOfInmates,
                      { inmate_name: "", relationship: "" },
                    ])
                  }
                >
                  + Add Inmate
                </button>
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setOpenCameraSection((prev) => !prev)}
              >
                Next
              </button>
            </div>
          </>
        )}

        {openCameraSection && (
          <>
            {/* CAMERA SECTION (two-column inside this card) */}
            <div className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* LEFT: Canvas / Video / Controls */}
                <div className="flex-1 flex flex-col items-center gap-4">
                  <div className="w-full max-w-md">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      width="320"
                      height="240"
                      className="w-full border rounded-lg mb-2 object-cover"
                    />
                    {/* Show canvas so user sees the snapshot area on the left column */}
                    <canvas
                      ref={canvasRef}
                      width="320"
                      height="240"
                      className="w-full border rounded-lg"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2">
                    <button
                      onClick={startCamera}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Start Camera
                    </button>
                    <button
                      onClick={captureImage}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Capture
                    </button>
                    <button
                      onClick={saveImages}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                      disabled={capturedImages.length === 0 || isLoading}
                    >
                      {isLoading ? "Loading..." : "Register"}
                    </button>
                  </div>
                </div>

                {/* RIGHT: Captured images (thumbnails stacked) */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-3">Taken Pictures</h3>
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-auto">
                    {capturedImages.length === 0 && (
                      <p className="text-sm text-gray-500 col-span-2">No pictures yet</p>
                    )}
                    {capturedImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`capture-${i}`}
                        className="w-full h-28 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                  onClick={() => setOpenCameraSection((prev) => !prev)}
                >
                  Go Back
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterFace;
