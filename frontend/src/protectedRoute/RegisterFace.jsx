import React, { useState } from "react";
import useRegisterFace from "../hooks/useRegisterFace";
import TakenPictureFallback from "../fallback/TakenPictureFallbackj";
import SelectInmates from "../helpers/SelectInmates";
import { genderOptions } from "../helpers/mockData";
import { Trash2, Camera, CameraOff, Save, User, Phone, MapPin, Venus, Mars, X, RotateCcw } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const inputBaseClasses = "w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#002868] placeholder-[#002868]";
const buttonBaseClasses = "px-4 py-2 rounded-md flex items-center justify-center gap-2 text-white transition cursor-pointer tracking-wide text-sm";

const InputField = ({ label, icon: Icon, value, onChange, hasError, helperText, placeholder, type = "text" }) => (
  <div>
    <label className="font-medium text-gray-700">{label}</label>
    <div className="relative mt-1">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputBaseClasses} ${hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#002868]"}`}
      />
    </div>
    {helperText && !hasError && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
    {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
  </div>
);

const RegisterFace = () => {
  const [isSelectInmateClicked, setIsSelectInmateClicked] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const {
    isLoading,
    hasErrors,
    videoRef,
    canvasRef,
    capturedImages,
    startCamera,
    captureImage,
    saveImages,
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
  } = useRegisterFace();

  const handleDeleteImage = (index) => setCapturedImages(prev => prev.filter((_, i) => i !== index));
  const handleRetakeAll = () => window.confirm("Are you sure you want to remove all captured images?") && setCapturedImages([]);

  const genderIcon = {
    Male: Mars,
    Female: Venus,
  }[visitorGender] || Mars;

  const relationshipOptions = ["Father","Mother","Brother","Sister","Son","Daughter","Spouse","Friend","Other"];

  return (
    <section className="sm:p-6 min-h-[100dvh] flex flex-col space-y-6">

      {/* Visitor Information */}
      <div className="max-w-5xl mx-auto w-full p-6 md:p-8 space-y-4 bg-white border border-gray-200 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold text-[#002868] border-b border-gray-200 pb-2">1. Visitor Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Full Name" icon={User} placeholder="e.g. Dina Lee Go" helperText="Enter the visitor’s name exactly as it appears on their ID." value={visitorName} onChange={e => setVisitorName(e.target.value)} hasError={hasErrors.visitor_name} />
          <InputField label="Contact" icon={Phone} placeholder="e.g. +63 912 345 6789" helperText="Use a valid Philippine mobile number." value={visitorContact} onChange={e => setVisitorContact(e.target.value)} hasError={hasErrors.visitor_contact} />

          {/* Gender */}
          <div>
            <label className="font-medium text-gray-700">Gender</label>
            <div className="relative mt-1">
              {React.createElement(genderIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 })}
              <select
                value={visitorGender}
                onChange={e => setVisitorGender(e.target.value)}
                className={`${inputBaseClasses} ${hasErrors.visitor_gender ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#002868]"}`}
              >
                <option value="">Select Gender</option>
                {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <InputField label="Address" icon={MapPin} placeholder="e.g. 123 Sampaguita St., Brgy. San Isidro, Quezon City" helperText="Enter the visitor’s complete address as shown on their ID." value={visitorAddress} onChange={e => setVisitorAddress(e.target.value)} hasError={hasErrors.visitor_address} />
        </div>

        {/* Inmates Section */}
        <div className="space-y-3">
          <label className="font-semibold text-gray-700">Inmate(s) the Visitor Will Visit</label>
          {visitorListOfInmates.length > 0 ? (
            visitorListOfInmates.map((v, i) => (
              <div key={v.id ?? i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 border border-gray-200 p-3 rounded-md">
                <div>
                  <div className="font-medium capitalize text-gray-800">{v.inmate_name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={v.relationship ?? ""}
                    onChange={e => setVisitorListOfInmates(prev => prev.map((item, idx) => idx === i ? { ...item, relationship: e.target.value } : item))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                  >
                    <option value="">Relationship</option>
                    {relationshipOptions.map(rel => <option key={rel} value={rel}>{rel}</option>)}
                  </select>
                  <button type="button" onClick={() => setVisitorListOfInmates(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-600 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-md p-6 bg-gray-50 text-gray-500 text-sm">
              No inmate selected yet
            </div>
          )}
        </div>

        <div className="flex justify-end mt-2">
          <SelectInmates
            setIsSelectInmateClicked={setIsSelectInmateClicked}
            isSelectInmateClicked={isSelectInmateClicked}
            onAdd={selected => setVisitorListOfInmates(selected.map(i => ({
              id: i._id,
              inmate_name: `${i.firstname}${i.middleInitial ? " " + i.middleInitial + "." : ""} ${i.lastname}`.trim(),
              relationship: "",
            })))}
          />
        </div>
      </div>

      {/* Face Recognition */}
      <div className="max-w-5xl mx-auto w-full p-6 md:p-8 space-y-4 bg-white border border-gray-200 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold text-[#002868] border-b border-gray-200 pb-2">2. Face Recognition Step</h2>
        <div className="w-full flex flex-col items-center space-y-4">
          {capturedImages.length === 0 ? (
            <TakenPictureFallback capturedImages={capturedImages} setCapturedImages={setCapturedImages} />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {capturedImages.map((img, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-md border border-gray-200 bg-[#232023]">
                    <img
                      src={img}
                      alt={`Captured ${index + 1}`}
                      className="w-full aspect-square object-cover cursor-pointer transition block"
                      onClick={() => { setLightboxIndex(index); setIsLightboxOpen(true); }}
                    />
                    <button onClick={() => handleDeleteImage(index)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition" title="Delete photo">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleRetakeAll} className="flex items-center gap-2 text-red-500 hover:text-red-600 transition font-medium">
                <RotateCcw size={16} /> Retake All Photos
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-start gap-4 mt-4">
          <button onClick={() => { startCamera(); setIsCameraOpen(true); }} className="px-4 py-2 rounded-md flex items-center justify-center gap-2 text-gray-500 border border-gray-300 hover:bg-gray-50 cursor-pointer font-semibold tracking-wide text-sm">
            <Camera size={18} /> Open Camera
          </button>
          <button
            onClick={saveImages}
            disabled={capturedImages.length === 0 || isLoading}
            className={`${buttonBaseClasses} ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#002868] hover:bg-blue-900"}`}
          >
            <Save size={18} /> {isLoading ? "Loading..." : "Register Visitor"}
          </button>
        </div>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="px-5 py-4 flex justify-between items-center border-b border-gray-300">
              <div>
                <h2 className="text-lg font-semibold">Face Capture</h2>
                <p className="text-gray-600 text-xs mt-1">Upload 3 to 4 clear images for optimal facial recognition</p>
              </div>
              <button onClick={() => setIsCameraOpen(false)} className="text-gray-600 transition"><X size={20} /></button>
            </div>

            {/* Body */}
            <div className="flex-grow p-4 sm:p-6 flex flex-col items-center space-y-4 overflow-y-auto">
              <div className="relative w-full h-[50vh] bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
                <canvas ref={canvasRef} width="320" height="240" className="hidden" />
              </div>
              {capturedImages.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto w-full">
                  {capturedImages.map((img, index) => (
                    <img key={index} src={img} alt={`Preview ${index + 1}`} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 flex justify-center gap-4">
              <button onClick={() => setIsCameraOpen(false)} className="inline-flex items-center justify-center gap-1 px-6 py-3 rounded-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition font-medium w-full cursor-pointer">
                Close
              </button>
              <button onClick={captureImage} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-sm text-white bg-red-500 hover:bg-red-600 transition font-medium w-full cursor-pointer">
                <CameraOff size={18} /> Capture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <Lightbox open={isLightboxOpen} close={() => setIsLightboxOpen(false)} index={lightboxIndex} slides={capturedImages.map(img => ({ src: img }))} />
      )}
    </section>
  );
};

export default RegisterFace;
