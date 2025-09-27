import useRegisterFace from "../hooks/useRegisterFace";

const RegisterFace = () => {
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
      <h1 className="text-2xl font-bold mb-4">Register Face Page</h1>

      {admin && (
        <p className="mb-2 text-gray-600">
          Logged in as: <b>{admin.first_name} {admin.last_name}</b>
        </p>
      )}

      <div className="mb-4 space-y-2">
        {/* Visitor Name */}
        <div>
          <input
            type="text"
            placeholder="Visitor's Name"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            className={`w-full border p-2 rounded ${
              hasErrors.visitor_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasErrors.visitor_name && (
            <p className="text-red-500 text-sm">{hasErrors.visitor_name}</p>
          )}
        </div>

        {/* Visitor Contact */}
        <div>
          <input
            type="text"
            placeholder="Visitor's Contact"
            value={visitorContact}
            onChange={(e) => setVisitorContact(e.target.value)}
            className={`w-full border p-2 rounded ${
              hasErrors.visitor_contact ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasErrors.visitor_contact && (
            <p className="text-red-500 text-sm">{hasErrors.visitor_contact}</p>
          )}
        </div>

        {/* Visitor Gender */}
        <div>
          <select
            value={visitorGender}
            onChange={(e) => setVisitorGender(e.target.value)}
            className={`w-full border p-2 rounded ${
              hasErrors.visitor_gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {hasErrors.visitor_gender && (
            <p className="text-red-500 text-sm">{hasErrors.visitor_gender}</p>
          )}
        </div>

        {/* Visitor Address */}
        <div>
          <input
            type="text"
            placeholder="Visitor's Address"
            value={visitorAddress}
            onChange={(e) => setVisitorAddress(e.target.value)}
            className={`w-full border p-2 rounded ${
              hasErrors.visitor_address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasErrors.visitor_address && (
            <p className="text-red-500 text-sm">{hasErrors.visitor_address}</p>
          )}
        </div>

        {/* Inmates List */}
        <div>
          <label className="block font-medium mb-1">Inmates to Visit</label>
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
                className="flex-1 border p-2 rounded"
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
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 rounded"
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
            className="bg-blue-500 text-white px-3 py-1 rounded"
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
      </div>

      {/* Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="300"
        height="200"
        className="border"
      />

      <div className="mt-2">
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Start Camera
        </button>

        <button
          onClick={captureImage}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Capture
        </button>

        <button
          onClick={saveImages}
          className="bg-purple-500 text-white px-4 py-2 rounded"
          disabled={capturedImages.length === 0 || isLoading}
        >
          {isLoading ? "Loading..." : "Register"}
        </button>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        {capturedImages.map((img, i) => (
          <img key={i} src={img} alt={`capture-${i}`} width="100" />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        width="300"
        height="200"
        style={{ display: "none" }}
      ></canvas>
    </div>
  );
};

export default RegisterFace;
