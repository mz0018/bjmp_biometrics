import { useFaceRecognition } from "../hooks/useFaceRecognition";
import { memo } from "react";

const boxStyle = "bg-black/70 px-4 py-2 rounded-lg text-white";

const VisitorInfo = memo(({ visitor }) => (
  <section className={`absolute bottom-3 left-3 ${boxStyle}`}>
    <p className="text-lg font-semibold">Visitor: {visitor.name}</p>
    <small className="text-xs text-gray-400 cursor-not-allowed lowercase">
      {visitor.visitor_id}
    </small>
    <p className="text-md">Inmate: {visitor.inmate}</p>
    <p className="text-md">Address: {visitor.address}</p>
  </section>
));

const NotFound = memo(() => (
  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-red-600/80 px-4 py-2 rounded-lg text-center text-white">
    <p className="text-lg font-semibold">Visitor Not Found</p>
  </div>
));

const Header = () => (
  <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white text-lg font-semibold z-10">
    Verification
  </div>
);

const Screen1 = () => {
  const { videoRef, canvasRef, visitor, notFound, fps, handleVideoPlay } =
    useFaceRecognition();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-[600px] h-[400px] bg-black rounded-xl shadow-2xl overflow-hidden">
        <Header />

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="none"
          aria-label="Face recognition camera"
          onPlay={handleVideoPlay}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {visitor && <VisitorInfo visitor={visitor} />}
        {notFound && <NotFound />}

        <div className="absolute top-3 left-3 bg-black/70 text-green-400 px-3 py-1 rounded-md text-sm font-mono shadow-md">
          FPS: {fps}
        </div>
      </div>
    </div>
  );
};

export default Screen1;
