import { useFaceRecognition } from "../hooks/useFaceRecognition";
import { memo, useState } from "react";

const boxStyle = "bg-black/70 px-4 py-2 rounded-lg text-white";

// Updated VisitorInfo to include inmate dropdown
const VisitorInfo = memo(({ visitor, onConfirm }) => {
  const [selectedInmate, setSelectedInmate] = useState("");

  const handleConfirm = () => {
    if (!selectedInmate) return;
    onConfirm(selectedInmate);
  };

  return (
    <section className={`absolute bottom-3 left-3 ${boxStyle}`}>
      <p className="text-lg font-semibold">Visitor: {visitor.name}</p>
      <small className="text-xs text-gray-400 lowercase block mb-2">
        {visitor.visitor_id}
      </small>
      <p className="text-md mb-1">Address: {visitor.address}</p>

      <label className="block text-sm mb-1">Select inmate to visit:</label>
      <select
        className="text-black px-2 py-1 rounded w-full mb-2"
        value={selectedInmate}
        onChange={(e) => setSelectedInmate(e.target.value)}
      >
        <option value="">-- Choose inmate --</option>
        {visitor.inmates?.map((inmate, idx) => (
          <option key={idx} value={JSON.stringify(inmate)}>
            {inmate.inmate_name} ({inmate.relationship})
          </option>
        ))}
      </select>

      <button
        onClick={handleConfirm}
        disabled={!selectedInmate}
        className={`w-full mt-1 px-3 py-1 rounded ${
          selectedInmate ? "bg-green-600" : "bg-gray-500"
        } text-white text-sm`}
      >
        Confirm
      </button>
    </section>
  );
});

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
  const {
    videoRef,
    canvasRef,
    visitor,
    notFound,
    fps,
    handleVideoPlay,
    handleInmateConfirmed,
  } = useFaceRecognition();

  const [inmateSelected, setInmateSelected] = useState(false);

  const handleConfirm = (inmateData) => {
    console.log("Selected inmate:", JSON.parse(inmateData));
    setInmateSelected(true);
    handleInmateConfirmed(); 
  };

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

        {visitor && !inmateSelected && (
          <VisitorInfo
            visitor={{
              ...visitor.visitor_info,
              visitor_id: visitor.visitor_id,
              inmates: visitor.visitor_info.inmates,
            }}
            onConfirm={handleConfirm}
          />
        )}

        {notFound && <NotFound />}

        <div className="absolute top-3 left-3 bg-black/70 text-green-400 px-3 py-1 rounded-md text-sm font-mono shadow-md">
          FPS: {fps}
        </div>
      </div>
    </div>
  );
};

export default Screen1;
