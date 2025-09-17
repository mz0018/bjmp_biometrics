import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import axios from "axios";

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

  const { setValue } = useContext(GlobalContext);

  useEffect(() => {
    let stream;

    const loadModels = async () => {
      try {
        await tf.setBackend("webgl");
        await tf.ready();
        console.log("✅ Using WebGL backend");
      } catch {
        await tf.setBackend("cpu");
        await tf.ready();
        console.log("⚠️ WebGL not available, using CPU backend");
      }

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68"),
      ]);
      console.log("✅ Models loaded");

      startVideo();
    };

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraActive(true);
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    loadModels();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleVideoPlay = useCallback(() => {
    let fpsCounter = 0;
    let fpsTimer = Date.now();

    const runDetection = async () => {
      if (!cameraActive || !videoRef.current || !canvasRef.current) {
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

      if (now - lastRecognition > 1500) {
        resized.forEach(async (res, i) => {
          const box = res.detection.box;
          if (recognitionQueue.current[i]) return;

          recognitionQueue.current[i] = true;

          const faceCanvas = faceCanvasRef.current;
          faceCanvas.width = box.width;
          faceCanvas.height = box.height;
          faceCanvas
            .getContext("2d")
            .drawImage(videoRef.current, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

          const faceBase64 = faceCanvas.toDataURL("image/jpeg");

          try {
            const res = await axios.post(`${import.meta.env.VITE_PY_API_URL}/recognize-face`, {
              image: faceBase64,
            });

            if (res.data.matched) {
              setVisitor(res.data.visitor);
              setValue(prev => !prev)

              if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
                setCameraActive(false);

                setTimeout(async () => {
                  setVisitor(null);
                  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                  if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraActive(true);
                    handleVideoPlay();
                  }
                }, 2000);
              }
            } else {
              setVisitor(null);
              setNotFound(true);
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
  }, [cameraActive, lastRecognition]);

  return { videoRef, canvasRef, visitor, notFound, fps, handleVideoPlay };
};
