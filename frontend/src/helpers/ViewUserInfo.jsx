import { useState, useEffect, useCallback } from "react";
import GenerateInmateInfo from "./GenerateInmateInfo";
import {
  UserRoundCog,
  X,
  User,
  Calendar,
  MapPin,
  Phone,
  Flag,
  Heart,
  Ruler,
  FileText,
  Gavel,
  Users,
  CheckSquare,
  Info,
  AlertTriangle,
} from "lucide-react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const ViewUserInfo = ({ userType, inmate, visitor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "N/A");

  const renderProfileItem = useCallback((label, value, icon) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 w-full gap-2" key={label}>
      <div className="flex items-center font-medium text-gray-700 text-xs sm:text-sm w-full sm:w-40">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="truncate">{label}:</span>
      </div>

      <input
        type="text"
        value={value ?? "N/A"}
        readOnly
        className="flex-grow w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm focus:outline-none cursor-default"
      />
    </div>
  ), []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const personalLeft = [
    { label: "First Name", value: inmate?.firstname, icon: <User className="w-4 h-4" /> },
    { label: "Middle Initial", value: inmate?.middleInitial, icon: <User className="w-4 h-4" /> },
    { label: "Last Name", value: inmate?.lastname, icon: <User className="w-4 h-4" /> },
    { label: "Gender", value: inmate?.gender, icon: <Users className="w-4 h-4" /> },
    { label: "Date of Birth", value: formatDate(inmate?.dateOfBirth), icon: <Calendar className="w-4 h-4" /> },
  ];

  const personalRight = [
    { label: "Nationality", value: inmate?.nationality, icon: <Flag className="w-4 h-4" /> },
    { label: "Address", value: inmate?.address, icon: <MapPin className="w-4 h-4" /> },
    { label: "Civil Status", value: inmate?.civilStatus, icon: <Heart className="w-4 h-4" /> },
    { label: "Height", value: inmate?.height, icon: <Ruler className="w-4 h-4" /> },
    { label: "Weight", value: inmate?.weight, icon: <Ruler className="w-4 h-4" /> },
  ];

  const criminalItems = [
    { label: "Case Number", value: inmate?.caseNumber, icon: <FileText className="w-4 h-4" /> },
    { label: "Court Name", value: inmate?.courtName, icon: <Gavel className="w-4 h-4" /> },
    { label: "Offense", value: inmate?.offense, icon: <Gavel className="w-4 h-4" /> },
    { label: "Arrest Date", value: formatDate(inmate?.arrestDate), icon: <Calendar className="w-4 h-4" /> },
    { label: "Sentence", value: inmate?.sentence, icon: <CheckSquare className="w-4 h-4" /> },
    { label: "Commitment Date", value: formatDate(inmate?.commitmentDate), icon: <Calendar className="w-4 h-4" /> },
    { label: "Status", value: inmate?.status, icon: <Info className="w-4 h-4" /> },
    { label: "Remarks", value: inmate?.remarks, icon: <Info className="w-4 h-4" /> },
  ];

  const visitorItems = [
    { label: "Name", value: visitor?.visitor_info?.name, icon: <User className="w-4 h-4" /> },
    { label: "Gender", value: visitor?.visitor_info?.gender, icon: <Users className="w-4 h-4" /> },
    { label: "Address", value: visitor?.visitor_info?.address, icon: <MapPin className="w-4 h-4" /> },
    { label: "Contact", value: visitor?.visitor_info?.contact, icon: <Phone className="w-4 h-4" /> },
  ];

  const images = [
    inmate?.mugshot_front ? { src: inmate.mugshot_front, title: "Front Mugshot" } : null,
    inmate?.mugshot_left ? { src: inmate.mugshot_left, title: "Left Mugshot" } : null,
    inmate?.mugshot_right ? { src: inmate.mugshot_right, title: "Right Mugshot" } : null,
  ].filter(Boolean);

  console.log(images)

  return (
    <>
      <button
        className="inline-flex items-center gap-2 bg-[#002868] hover:bg-blue-900 text-white px-4 py-2 rounded-sm transition cursor-pointer"
        onClick={() => setIsModalOpen((p) => !p)}
        aria-label="View user information"
      >
        <UserRoundCog className="w-4 h-4" />
        <span>View</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div
            className={`rounded-md shadow-lg w-full max-h-[90vh] ${
              userType === "visitor" ? "max-w-md" : "max-w-3xl"
            } flex flex-col`}
          >
            <div className="bg-[#232023] px-4 py-4 sm:px-6 sm:py-5 rounded-t-md shadow-md sticky top-0 z-10 flex justify-between items-center">
              <h2 className="text-left text-lg sm:text-xl font-semibold text-white">
                {userType === "inmate" ? "Inmate Information" : "Visitor Information"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`bg-white ${userType === "inmate" ? "overflow-y-auto" : ""} flex-grow max-h-[70vh] p-4 sm:p-6`}>
              {userType === "inmate" && inmate && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-left font-semibold text-gray-700 uppercase text-sm sm:text-base">Personal Details</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        {personalLeft.map((it) => renderProfileItem(it.label, it.value, it.icon))}
                      </div>
                      <div className="space-y-1">
                        {personalRight.map((it) => renderProfileItem(it.label, it.value, it.icon))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-left font-semibold text-gray-700 uppercase text-sm sm:text-base">Criminal Details</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {criminalItems.map((it) => renderProfileItem(it.label, it.value, it.icon))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-left font-semibold text-gray-700 text-sm sm:text-base">Mugshots</h3>
                    <hr className="border-gray-300 my-2" />
                    {images.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-4 mt-3">
                        {images.map((img, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => {
                              setPhotoIndex(index);
                              setLightboxOpen(true);
                            }}
                          >
                            <img
                              src={img.src}
                              alt={img.title}
                              className="w-40 h-48 object-cover rounded-md border border-gray-300 shadow-sm"
                            />
                            <span className="text-xs text-gray-600 mt-1">{img.title.split(" ")[0]}</span>
                          </div>
                        ))}

                        {lightboxOpen && (
                          <Lightbox
                            open={lightboxOpen}
                            close={() => setLightboxOpen(false)}
                            index={photoIndex}
                            slides={images}
                          />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic mt-2">No mugshots available.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-left font-semibold text-gray-700 text-sm sm:text-base">Visitor Related</h3>
                    <hr className="border-gray-300 my-2" />
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>List of Visitor(s) related to this specific inmate</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-left font-semibold text-gray-700 text-sm sm:text-base">Generate Document</h3>
                    <GenerateInmateInfo inmate={inmate} />
                  </div>
                </div>
              )}

              {userType === "visitor" && visitor && (
                <div className="grid grid-cols-1 gap-2">
                  {visitorItems.map((it) => renderProfileItem(it.label, it.value, it.icon))}
                </div>
              )}
            </div>

            <div className="bg-[#232023] px-4 py-3 rounded-b-md flex flex-col items-center justify-center text-center space-y-1">
              {userType === "inmate" && (
                <>
                  <p className="text-gray-400 text-[11px] m-0">Confidential — Authorized personnel only.</p>
                  <p className="text-gray-500 text-[10px] m-0">© {new Date().getFullYear()} Bureau of Jail Management and Penology</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewUserInfo;
