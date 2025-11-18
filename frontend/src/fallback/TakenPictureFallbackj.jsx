import React from "react";
import { X, Image as ImageIcon } from "lucide-react";

const TakenPictureFallback = ({
  capturedImages = [], 
  setCapturedImages = () => {}, 
}) => {
  const hasNoPictures = capturedImages.length === 0;

  return (
    <div className="flex-[1.2] rounded-md p-4 sm:p-6 w-full border border-gray-300 bg-gray-50">
      <div
        className={`overflow-y-auto pr-2 ${
          hasNoPictures ? "flex items-center justify-center" : ""
        }`}
        style={{ height: "50vh" }}
      >
        {hasNoPictures ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={48} className="mb-3 opacity-70" />
            <p className="text-xs text-center">
              No pictures yet. <br /> Captured photos will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {capturedImages.map((img, i) => (
              <div key={i} className="relative rounded-md overflow-hidden">
                <img
                  src={img}
                  alt={`capture-${i}`}
                  className="w-full h-48 object-cover block"
                />
                <button
                  onClick={() =>
                    setCapturedImages((prev) =>
                      prev.filter((_, index) => index !== i)
                    )
                  }
                  className="absolute top-2 right-2 bg-gray-600 text-white p-1.5 rounded-xl shadow hover:bg-gray-700 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TakenPictureFallback;
