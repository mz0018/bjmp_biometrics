import { memo, useState } from "react";
import useFaceRecognition from "../hooks/useFaceRecognition";
import api from "../api";

const boxStyle = "bg-black/70 px-4 py-2 rounded-lg text-white";

const VisitorInfo = memo(({ visitor, onConfirm }) => {
  const [selectedInmate, setSelectedInmate] = useState("");

  const handleConfirm = async () => {
    if (!selectedInmate) return;
    const inmateObj = JSON.parse(selectedInmate);

    try {
      const res = await api.post("/recognize-face", {
        visitor_id: visitor.visitor_id,
        visitor_info: {
          name: visitor.visitor_info.name,
          address: visitor.visitor_info.address,
          contact: visitor.visitor_info.contact,
          inmates: visitor.visitor_info.inmates,
        },
        selected_inmate: inmateObj,
        similarity: visitor.similarity,
      });

      const savedLog = res.data?.log;
      console.log("Backend response:", res.data);

      if (res.data?.status === "success") {
        onConfirm(savedLog);
      } else if (res.data?.status === "duplicate") {
        alert("Duplicate visit detected. Cannot confirm again.");
      } else {
        alert("Failed to save visit: " + (res.data?.message || "unknown"));
      }
    } catch (err) {
      console.error("Save visit error:", err);
      alert("Failed to save visit (network error)");
    }
  };

  return (
    <section className={`${boxStyle} absolute bottom-3 left-3 w-[300px]`}>
      <p className="text-lg font-semibold">Visitor: {visitor.visitor_info?.name}</p>
      <small className="text-xs text-gray-400 lowercase block mb-2">{visitor.visitor_id}</small>
      <p className="text-md mb-1">Address: {visitor.visitor_info?.address}</p>

      <label className="block text-sm mb-1">Select inmate to visit:</label>
      <select
        className="text-black px-2 py-1 rounded w-full mb-2"
        value={selectedInmate}
        onChange={(e) => setSelectedInmate(e.target.value)}
      >
        <option value="">-- Choose inmate --</option>
        {visitor.visitor_info?.inmates?.map((inmate, idx) => (
          <option key={idx} value={JSON.stringify(inmate)}>
            {inmate.inmate_name} ({inmate.relationship})
          </option>
        ))}
      </select>

      <button
        onClick={handleConfirm}
        disabled={!selectedInmate}
        className={`w-full px-3 py-1 rounded text-sm ${
          selectedInmate ? "bg-green-600" : "bg-gray-500"
        } text-white`}
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

  const handleConfirm = async (savedLog) => {
    console.log("Confirm clicked. savedLog received in Screen1:", savedLog);
    setInmateSelected(true);
    await handleInmateConfirmed(savedLog.selected_inmate);

    setInmateSelected(false);
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
            visitor={visitor}
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
