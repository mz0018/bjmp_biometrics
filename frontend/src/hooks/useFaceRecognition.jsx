import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import api from "../api";

export const useFaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceCanvasRef = useRef(document.createElement("canvas"));
  const frameRef = useRef(null);

  const [fps, setFps] = useState(0);
  const [visitor, setVisitor] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const cameraActiveRef = useRef(true);

  const [lastRecognition, setLastRecognition] = useState(0);
  const lastRecognitionRef = useRef(0);

  const recognitionQueue = useRef({});
  const modelsLoadedRef = useRef(false);

  useEffect(() => {
    let stream;
    const init = async () => {
      try {
        await tf.setBackend("webgl");
      } catch {
        await tf.setBackend("cpu");
      }
      await tf.ready();

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68"),
      ]);

      modelsLoadedRef.current = true;

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraActive(true);
        cameraActiveRef.current = true;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    init();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    cameraActiveRef.current = cameraActive;
  }, [cameraActive]);

  const restartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
        setCameraActive(true);
        cameraActiveRef.current = true;
      }
    } catch (err) {
      console.error("Error restarting camera:", err);
      throw err;
    }
  };

  const handleVideoPlay = useCallback(() => {
    let fpsCounter = 0;
    let fpsTimer = Date.now();

    const runDetection = async () => {
      if (!videoRef.current || !canvasRef.current || !cameraActiveRef.current) {
        frameRef.current = requestAnimationFrame(runDetection);
        return;
      }

      const detections = await faceapi
        .detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 })
        )
        .withFaceLandmarks();

      const { videoWidth, videoHeight } = videoRef.current;
      const displaySize = { width: videoWidth, height: videoHeight };

      faceapi.matchDimensions(canvasRef.current, displaySize);
      const resized = faceapi.resizeResults(detections, displaySize);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

      fpsCounter++;
      const now = Date.now();
      if (now - fpsTimer > 500) {
        setFps(Math.round((fpsCounter * 1000) / (now - fpsTimer)));
        fpsCounter = 0;
        fpsTimer = now;
      }

      if (now - lastRecognitionRef.current > 1500) {
        resized.forEach(async (res, i) => {
          if (recognitionQueue.current[i]) return;
          recognitionQueue.current[i] = true;

          try {
            const { x, y, width, height } = res.detection.box;
            const faceCanvas = faceCanvasRef.current;
            faceCanvas.width = width;
            faceCanvas.height = height;
            faceCanvas
              .getContext("2d")
              .drawImage(videoRef.current, x, y, width, height, 0, 0, width, height);

            const faceBase64 = faceCanvas.toDataURL("image/jpeg");
            const resApi = await api.post("/recognize-face", { image: faceBase64 });

            if (resApi.data?.status === "success") {
              setVisitor(
                resApi.data.log || {
                  visitor_info: resApi.data.visitor,
                  visitor_id: resApi.data.visitor_id,
                  similarity: resApi.data.similarity,
                }
              );
              setNotFound(false);

              videoRef.current?.srcObject?.getTracks().forEach((t) => t.stop());
              setCameraActive(false);
              cameraActiveRef.current = false;
            } else {
              setVisitor(null);
              setNotFound(true);
              console.log("No match:", resApi.data?.message || "Visitor not found");
            }
          } catch (err) {
            console.error("Recognition error:", err);
          } finally {
            delete recognitionQueue.current[i];
          }
        });
        setLastRecognition(now);
        lastRecognitionRef.current = now;
      }

      frameRef.current = requestAnimationFrame(runDetection);
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    runDetection();
  }, []);

  const forcefulRestartRecognition = async () => {
    setVisitor(null);
    setNotFound(false);
    recognitionQueue.current = {};
    setLastRecognition(0);
    lastRecognitionRef.current = 0;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    if (videoRef.current?.srcObject) {
      try {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      } catch (e) {}
      videoRef.current.srcObject = null;
    }

    if (!modelsLoadedRef.current) {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68"),
        ]);
        modelsLoadedRef.current = true;
      } catch (e) {
        console.error("Failed to load models on restart:", e);
      }
    }

    await tf.ready();

    try {
      await restartCamera();
      if (videoRef.current) {
        videoRef.current.addEventListener("playing", handleVideoPlay, { once: true });
        handleVideoPlay();
      }
    } catch (err) {
      console.error("forceful restart failed:", err);
    }
  };

  const handleInmateConfirmed = async () => {
    await forcefulRestartRecognition();
  };

  return {
    videoRef,
    canvasRef,
    visitor,
    setVisitor,
    notFound,
    fps,
    handleVideoPlay,
    handleInmateConfirmed,
    restartCamera,
    forcefulRestartRecognition,
  };
};

export default useFaceRecognition;
