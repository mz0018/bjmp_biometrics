import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import GenerateInmateInfo from "./GenerateInmateInfo";
import {
  View,
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
  const [visitLogs, setVisitLogs] = useState([]);
  const [isVisitLoading, setIsVisitLoading] = useState(false);

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

    // Fetch visit history when opening visitor modal (if we have visitor_id)
    if (isModalOpen && userType === "visitor" && visitor?.visitor_id) {
      const controller = new AbortController();
      const fetchHistory = async () => {
        try {
          setIsVisitLoading(true);
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/admin/visitorsLogs`,
            { params: { visitor_id: visitor.visitor_id }, signal: controller.signal }
          );
          setVisitLogs(res.data || []);
        } catch (err) {
          if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
          console.error("Failed to fetch visit history:", err);
          setVisitLogs([]);
        } finally {
          setIsVisitLoading(false);
        }
      };

      fetchHistory();

      return () => {
        try { controller.abort(); } catch (e) {}
        document.body.style.overflow = "auto";
      };
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, userType, visitor]);

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

  return (
    <>
      <button
        className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-sm flex items-center gap-2 cursor-pointer transition"
        onClick={() => setIsModalOpen((p) => !p)}
        aria-label="View user information"
        title="View user information"
      >
        <View className="w-5 h-5" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div
            className={`rounded-md shadow-lg w-full max-h-[90vh] ${
              userType === "visitor" ? "max-w-md" : "max-w-3xl"
            } flex flex-col`}
          >
            <div className="bg-white px-4 py-4 sm:px-6 sm:py-5 rounded-t-md shadow-md sticky top-0 z-10 flex justify-between items-start">
              <div className="flex flex-col">
                <h2 className="text-left text-lg sm:text-xl font-bold text-gray-900">
                  {userType === "inmate" ? "Inmate Information" : "Visitor Information"}
                </h2>
                <p className="text-gray-600">
                  {userType === "inmate"
                    ? "View detailed information about the inmate below."
                    : "View detailed information about the visitor below."}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`bg-white ${
                userType === "inmate" ? "overflow-y-auto" : ""
              } flex-grow max-h-[70vh] p-4 sm:p-6`}
            >
              {userType === "inmate" && inmate && (
                <div className="space-y-10">
                  {/* PERSONAL INFORMATION */}
                  <div>
                    <h3 className="text-left font-semibold text-gray-900 tracking-wider uppercase text-sm sm:text-base">
                      Personal Information
                    </h3>
                    <hr className="border-gray-400 mt-2 mb-5" />

                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto border-collapse">
                        <tbody>
                          <tr>
                            {personalLeft.map((it) => (
                              <td
                                key={it.label}
                                className="border-b border-gray-300 py-2 px-4 text-sm text-gray-700"
                              >
                                <strong>{it.label}:</strong> {it.value}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            {personalRight.map((it) => (
                              <td
                                key={it.label}
                                className="border-b border-gray-300 py-2 px-4 text-sm text-gray-700"
                              >
                                <strong>{it.label}:</strong> {it.value}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* CRIMINAL RECORD */}
                  <div>
                    <h3 className="text-left font-semibold text-gray-900 tracking-wider uppercase text-sm sm:text-base">
                      Criminal Record
                    </h3>
                    <hr className="border-gray-400 mt-2 mb-5" />

                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto border-collapse">
                        <tbody>
                          {criminalItems.map((it) => (
                            <tr key={it.label}>
                              <td className="border-b border-gray-300 py-2 px-4 text-sm text-gray-700">
                                <strong>{it.label}:</strong> {it.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* MUGSHOT GALLERY */}
                  <div>
                    <h3 className="text-left font-semibold text-gray-900 tracking-wider uppercase text-sm sm:text-base">
                      Mugshot Gallery
                    </h3>
                    <hr className="border-gray-400 mt-2 mb-5" />

                    {images.length > 0 ? (
                      <div className="flex flex-wrap justify-start gap-6 mt-3">
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
                              className="w-40 h-52 object-cover border border-gray-400 shadow-sm"
                            />
                            <span className="text-xs text-gray-700 mt-3 font-medium tracking-wide">
                              {img.title.split(" ")[0]}
                            </span>
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
                      <p className="text-sm text-gray-500 italic mt-3">
                        No mugshots available.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* VISITOR VIEW */}
              {userType === "visitor" && visitor && (
                <div className="grid grid-cols-1">
                  {visitorItems.map((it) => renderProfileItem(it.label, it.value, null))}

                  <div>
                    
                    <hr className="border-gray-400 mt-2 mb-3" />

                    {isVisitLoading ? (
                      <p className="text-sm text-gray-500">Loading history...</p>
                    ) : visitLogs && visitLogs.length > 0 ? (
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Total visits</div>
                          <div className="text-gray-600">{visitLogs.length}</div>
                        </div>

                        <div className="max-h-44 overflow-y-auto mt-2 border border-gray-100 rounded p-2 bg-gray-50">
                          {visitLogs.map((vl) => (
                            <div key={vl._id} className="flex items-center justify-between py-1 px-2 border-b last:border-b-0">
                              <div className="truncate">
                                {vl.selected_inmate?.inmate_name || (vl.visitor_info?.inmates && vl.visitor_info.inmates[0]?.inmate_name) || "—"}
                              </div>
                              <div className="text-gray-500 text-xs ml-4 whitespace-nowrap">
                                {vl.timestamp ? new Date(vl.timestamp).toLocaleString() : "—"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No visit history found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Close and Action Buttons */}
            <div className="border-t border-gray-300 bg-white px-4 py-3 rounded-b-md flex flex-col space-y-1">
              
                <div className="flex justify-between w-full gap-1">
                  <button
                    className="border border-gray-300 hover:bg-gray-50 text-gray-500 font-semibold px-6 py-3 rounded-sm text-sm transition w-full cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                  {userType === "inmate" && (
                  <GenerateInmateInfo inmate={inmate} />
                  )}
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewUserInfo;
