import { useState, useRef, useEffect } from "react";
import axios from "axios";

const useRegisterFace = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedImages, setCapturedImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState({})

  const [admin, setAdmin] = useState(null);

  const [visitorName, setVisitorName] = useState("");
  const [inmateName, setInmateName] = useState("");
  const [visitorAddress, setVisitorAddress] = useState("");

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
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

    if (!visitorName || !inmateName || !visitorAddress) {
      alert("Please fill out all visitor details before saving.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PY_API_URL}/register-face`,
        {
          images: capturedImages,
          id: admin._id || admin.id,
          first_name: admin.first_name,
          last_name: admin.last_name,
          visitor_name: visitorName,
          inmate_name: inmateName,
          visitor_address: visitorAddress,
        }
      );

      alert("Images and visitor details sent to backend!");
      console.log("Server response:", response.data);
    } catch (err) {
      console.error("Error sending images:", err);
      alert("Failed to send data!");
    }
  };

  return {
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
  };
};

export default useRegisterFace;
