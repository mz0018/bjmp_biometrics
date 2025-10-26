import { useState, useRef, useEffect } from "react";
import api from "../api";

const useRegisterFace = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedImages, setCapturedImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState({});

  const [admin, setAdmin] = useState(null);

  const [visitorName, setVisitorName] = useState("");
  const [visitorAddress, setVisitorAddress] = useState("");
  const [visitorContact, setVisitorContact] = useState("");
  const [visitorGender, setVisitorGender] = useState("");

  const [visitorListOfInmates, setVisitorListOfInmates] = useState([]);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const resetForm = () => {
    setVisitorName("");
    setVisitorAddress("");
    setVisitorContact("");
    setVisitorGender("");
    setVisitorListOfInmates([]);
  };

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
      console.warn("No admin found in localStorage");
      alert("Admin details not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setHasErrors({});

    try {
      if (visitorListOfInmates.length > 0) {
        const missingRel = visitorListOfInmates.some(
          (v) => !v.relationship || v.relationship.trim() === ""
        );
        if (missingRel) {
          console.warn("Missing relationship in selected inmates");
          setHasErrors({ general: "Please set relationship for all selected inmates." });
          setIsLoading(false);
          return;
        }
      }

      const inmatesPayload = visitorListOfInmates.map((v) => ({
        id: v.id ?? null,
        inmate_name: v.inmate_name ?? "",
        caseNumber: v.caseNumber ?? "",
        relationship: v.relationship ?? "",
      }));

      // ✅ You were missing this line — now response is defined
      const response = await api.post("/register-face", {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        visitor_name: visitorName,
        visitor_address: visitorAddress,
        visitor_contact: visitorContact,
        visitor_gender: visitorGender,
        inmates: inmatesPayload,
        images: capturedImages,
      });

      if (response.data.status === "error") {
        console.error("Backend validation errors:", response.data.errors);
        setHasErrors(response.data.errors);
        setIsLoading(false);
        return;
      }

      if (response.data.status === "success") {
        alert("Images and visitor details sent to backend!");
        resetForm();
        setCapturedImages([]);
      }

    } catch (err) {
      console.error("ERROR sending images:", err);

      if (err.response && err.response.data && err.response.data.errors) {
        setHasErrors(err.response.data.errors);
      } else {
        alert("Failed to send data!");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return {
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
    setCapturedImages,
  };
};

export default useRegisterFace;
