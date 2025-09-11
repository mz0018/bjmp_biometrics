import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Screen1 = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [fps, setFps] = useState(0);
  const [lastRecognition, setLastRecognition] = useState(0);
  const [recognitionQueue, setRecognitionQueue] = useState({}); // Track which faces are being recognized

  useEffect(() => {
    let stream;

    const loadModels = async () => {
      try {
        await tf.setBackend("webgl");
        await tf.ready();
        console.log("✅ Using WebGL backend");
      } catch (err) {
        await tf.setBackend("cpu");
        await tf.ready();
        console.log("⚠️ WebGL not available, using CPU backend");
      }

      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68");
      console.log("✅ Models loaded");

      startVideo();
    };

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    loadModels();

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleVideoPlay = async () => {
    let lastTime = performance.now();

    const runDetection = async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
          )
          .withFaceLandmarks();

        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);
        const resized = faceapi.resizeResults(detections, displaySize);

        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw boxes and landmarks
        faceapi.draw.drawDetections(canvasRef.current, resized);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

        // FPS calculation
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        setFps(Math.round(1 / delta));

        const currentTime = Date.now();
        if (currentTime - lastRecognition > 1000) {
          for (let i = 0; i < resized.length; i++) {
            const detection = resized[i];
            const box = detection.detection.box;

            // Skip if already recognizing this face
            if (recognitionQueue[i]) continue;

            // Mark face as being recognized
            setRecognitionQueue((prev) => ({ ...prev, [i]: true }));

            // Extract face image
            const faceCanvas = document.createElement("canvas");
            faceCanvas.width = box.width;
            faceCanvas.height = box.height;
            const faceCtx = faceCanvas.getContext("2d");
            faceCtx.drawImage(
              videoRef.current,
              box.x, box.y, box.width, box.height,
              0, 0, box.width, box.height
            );

            const faceBase64 = faceCanvas.toDataURL("image/jpeg");

            // Draw "Recognizing..." text
            ctx.font = "14px Arial";
            ctx.fillStyle = "yellow";
            ctx.fillText("Recognizing...", box.x, box.y > 15 ? box.y - 5 : box.y + 15);

            try {
              const res = await axios.post("http://127.0.0.1:5001/api/recognize-face", {
                image: faceBase64,
              });

              console.log(res.data.visitor)

              const text = res.data.matched
                ? `${res.data.visitor?.visitor_name || "Unknown"} | Inmate: ${res.data.visitor?.inmate_name || "Unknown"}`
                : "Unknown";

              ctx.fillStyle = "lime";
              ctx.fillText(text, box.x, box.y > 15 ? box.y - 5 : box.y + 15);
            } catch (err) {
              console.error("Recognition error:", err);
              ctx.fillStyle = "red";
              ctx.fillText("Recognition error", box.x, box.y > 15 ? box.y - 5 : box.y + 15);
            } finally {
              // Remove from queue
              setRecognitionQueue((prev) => {
                const newQueue = { ...prev };
                delete newQueue[i];
                return newQueue;
              });
            }
          }
          setLastRecognition(currentTime);
        }
      }

      requestAnimationFrame(runDetection);
    };

    runDetection();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-[600px] h-[400px] bg-black rounded-xl shadow-2xl overflow-hidden">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white text-lg font-semibold z-10">
          Verification
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onPlay={handleVideoPlay}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        <div className="absolute top-3 left-3 bg-black/70 text-green-400 px-3 py-1 rounded-md text-sm font-mono shadow-md">
          FPS: {fps}
        </div>
      </div>
    </div>
  );
};

export default Screen1;
