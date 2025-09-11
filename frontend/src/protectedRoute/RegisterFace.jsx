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
    inmateName,
    setInmateName,
    visitorAddress,
    setVisitorAddress,
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

        <div>
          <input
            type="text"
            placeholder="Inmate to Visit"
            value={inmateName}
            onChange={(e) => setInmateName(e.target.value)}
            className={`w-full border p-2 rounded ${
              hasErrors.inmate_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasErrors.inmate_name && (
            <p className="text-red-500 text-sm">{hasErrors.inmate_name}</p>
          )}
        </div>

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
      </div>

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
          {isLoading ? 'Loading...' : 'Register'}
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
