import { useRef, useState, useEffect } from "react";
import axios from "axios";

const RegisterFace = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Could not access webcam");
    }
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 200);
    const imageData = canvasRef.current.toDataURL("image/png");

    setCapturedImages((prev) => [...prev, imageData]);
  };

  const saveImages = async () => {
    if (!admin) {
      alert("Admin details not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PY_API_URL}/register-face`,
        {
          images: capturedImages,
          id: admin.id,
          first_name: admin.first_name,
          last_name: admin.last_name,
        }
      );

      alert("Images sent to backend!");
      console.log("Server response:", response.data);
    } catch (err) {
      console.error("Error sending images:", err);
      alert("Failed to send images!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Register Face Page</h1>

      {admin && (
        <p className="mb-2 text-gray-600">
          Logged in as: <b>{admin.first_name} {admin.last_name}</b>
        </p>
      )}

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
          disabled={capturedImages.length === 0}
        >
          Save Images
        </button>
      </div>

      <div className="flex gap-2 mt-4">
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
