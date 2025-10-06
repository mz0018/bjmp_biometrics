// src/hooks/useFaceRecognition.jsx
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
  const [lastRecognition, setLastRecognition] = useState(0);
  const recognitionQueue = useRef({});

  useEffect(() => {
    let stream;

    const loadModelsAndStart = async () => {
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

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraActive(true);
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    loadModelsAndStart();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const restartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (e) {
        }
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error restarting camera:", err);
    }
  };

  const handleInmateConfirmed = async () => {
    setVisitor(null);
    await new Promise((r) => setTimeout(r, 200));
    await restartCamera();
  };

  const handleVideoPlay = useCallback(() => {
    let fpsCounter = 0;
    let fpsTimer = Date.now();

    const runDetection = async () => {
      if (!videoRef.current || !canvasRef.current) {
        frameRef.current = requestAnimationFrame(runDetection);
        return;
      }

      if (!cameraActive) {
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

      // draw boxes
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const resized = faceapi.resizeResults(detections, displaySize);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

      // fps
      fpsCounter++;
      const now = Date.now();
      if (now - fpsTimer > 500) {
        setFps(Math.round((fpsCounter * 1000) / (now - fpsTimer)));
        fpsCounter = 0;
        fpsTimer = now;
      }

      // perform recognition at most once every 1.5s
      if (now - lastRecognition > 1500) {
        resized.forEach(async (res, i) => {
          if (recognitionQueue.current[i]) return;
          recognitionQueue.current[i] = true;

          try {
            const box = res.detection.box;
            const faceCanvas = faceCanvasRef.current;
            faceCanvas.width = box.width;
            faceCanvas.height = box.height;
            faceCanvas
              .getContext("2d")
              .drawImage(videoRef.current, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

            const faceBase64 = faceCanvas.toDataURL("image/jpeg");

            const resApi = await api.post("/recognize-face", { image: faceBase64 });

            if (resApi.data?.status === "success") {
              // Backend returns object under `log` (visitor info + ids)
              // normalize into local visitor state
              setVisitor(resApi.data.log || {
                visitor_info: resApi.data.visitor,
                visitor_id: resApi.data.visitor_id,
                similarity: resApi.data.similarity,
              });
              setNotFound(false);

              // stop camera (pause detection) — visitor will confirm or cancel
              if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
              }
              setCameraActive(false);
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
      }

      frameRef.current = requestAnimationFrame(runDetection);
    };

    runDetection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive, lastRecognition]);

  return {
    videoRef,
    canvasRef,
    visitor,
    setVisitor,
    notFound,
    fps,
    handleVideoPlay,
    handleInmateConfirmed,
    restartCamera, // exported in case you want to call it directly
  };
};

export default useFaceRecognition;
