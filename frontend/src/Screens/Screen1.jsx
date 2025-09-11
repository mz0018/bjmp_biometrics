import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

import { useEffect, useRef, useState } from "react";

const Screen1 = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let stream;

    const loadModels = async () => {
      try {
        // Try WebGL first
        await tf.setBackend("webgl");
        await tf.ready();
        console.log("✅ Using WebGL backend");
      } catch (err) {
        // Fallback to CPU
        await tf.setBackend("cpu");
        await tf.ready();
        console.log("⚠️ WebGL not available, using CPU backend");
      }

      // Load models
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68");

      console.log("✅ Models loaded");

      startVideo();
    };

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    loadModels();

    // Cleanup on unmount
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

        // ✅ Draw box + landmarks
        faceapi.draw.drawDetections(canvasRef.current, resized);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

        // ✅ FPS calculation
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        setFps(Math.round(1 / delta));
      }

      requestAnimationFrame(runDetection);
    };

    runDetection();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative w-[600px] h-[400px] bg-black rounded-xl shadow-2xl overflow-hidden">
        {/* Title */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white text-lg font-semibold z-10">
            Verification
        </div>

        {/* Video */}
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onPlay={handleVideoPlay}
            className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Canvas Overlay */}
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />

        {/* FPS Counter */}
        <div className="absolute top-3 left-3 bg-black/70 text-green-400 px-3 py-1 rounded-md text-sm font-mono shadow-md">
            FPS: {fps}
        </div>
        </div>
    </div>
    );
};

export default Screen1;
