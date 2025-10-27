import { useState } from "react";
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
} from "lucide-react";

const ViewUserInfo = ({ userType, inmate, visitor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderProfileItem = (label, value, icon) => (
    <div className="flex items-center justify-between py-1 border-b border-gray-200">
      <div className="flex items-center gap-2 font-medium text-gray-700">
        {icon && <span>{icon}</span>}
        {label}:
      </div>
      <div className="text-gray-900">{value || "N/A"}</div>
    </div>
  );

  return (
    <>
      <button
        className="inline-flex items-center gap-2 bg-[#002868] hover:bg-blue-900 text-white px-4 py-2 rounded-sm transition cursor-pointer"
        onClick={() => setIsModalOpen((prev) => !prev)}
        aria-label="View user information"
      >
        <UserRoundCog className="w-4 h-4" />
        <span>View</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div
            className={`bg-white p-6 rounded-md shadow-lg w-full max-h-[90vh] ${
              userType === "visitor" ? "max-w-md" : "max-w-3xl"
            } flex flex-col`}
          >
           <div>
             <h2 className="text-center text-lg font-semibold mb-3 text-gray-800 bg-blue-500">
              {userType === "inmate" ? "Inmate Information" : "Visitor Information"}
            </h2>
           </div>

            {/* Scrollable content container for inmate only */}
            <div
              className={`${
                userType === "inmate" ? "overflow-y-auto" : ""
              } flex-grow max-h-[70vh]`}
            >
              {userType === "inmate" && inmate && (
                <div className="space-y-6">
                  {/* Personal Details */}
                  <div>
                    <h3 className="text-left font-semibold text-gray-700 mb-3">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        {renderProfileItem("First Name", inmate.firstname, <User className="w-4 h-4" />)}
                        {renderProfileItem("Middle Initial", inmate.middleInitial, <User className="w-4 h-4" />)}
                        {renderProfileItem("Last Name", inmate.lastname, <User className="w-4 h-4" />)}
                        {renderProfileItem("Gender", inmate.gender, <Users className="w-4 h-4" />)}
                        {renderProfileItem(
                          "Date of Birth",
                          new Date(inmate.dateOfBirth).toLocaleDateString(),
                          <Calendar className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        {renderProfileItem("Nationality", inmate.nationality, <Flag className="w-4 h-4" />)}
                        {renderProfileItem("Address", inmate.address, <MapPin className="w-4 h-4" />)}
                        {renderProfileItem("Civil Status", inmate.civilStatus, <Heart className="w-4 h-4" />)}
                        {renderProfileItem("Height", inmate.height, <Ruler className="w-4 h-4" />)}
                        {renderProfileItem("Weight", inmate.weight, <Ruler className="w-4 h-4" />)}
                      </div>
                    </div>
                  </div>

                  {/* Criminal Details */}
                  <div>
                    <h3 className="text-left font-semibold text-gray-700 mb-3">Criminal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        {renderProfileItem("Case Number", inmate.caseNumber, <FileText className="w-4 h-4" />)}
                        {renderProfileItem("Offense", inmate.offense, <Gavel className="w-4 h-4" />)}
                        {renderProfileItem("Sentence", inmate.sentence, <CheckSquare className="w-4 h-4" />)}
                      </div>
                      <div>
                        {renderProfileItem("Court Name", inmate.courtName, <Gavel className="w-4 h-4" />)}
                        {renderProfileItem(
                          "Arrest Date",
                          new Date(inmate.arrestDate).toLocaleDateString(),
                          <Calendar className="w-4 h-4" />
                        )}
                        {renderProfileItem(
                          "Commitment Date",
                          new Date(inmate.commitmentDate).toLocaleDateString(),
                          <Calendar className="w-4 h-4" />
                        )}
                        {renderProfileItem("Status", inmate.status, <Info className="w-4 h-4" />)}
                        {renderProfileItem("Remarks", inmate.remarks, <Info className="w-4 h-4" />)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userType === "visitor" && visitor && (
                <div className="grid grid-cols-1 gap-1">
                  {renderProfileItem("Name", visitor?.visitor_info?.name, <User className="w-4 h-4" />)}
                  {renderProfileItem("Gender", visitor?.visitor_info?.gender, <Users className="w-4 h-4" />)}
                  {renderProfileItem("Address", visitor?.visitor_info?.address, <MapPin className="w-4 h-4" />)}
                  {renderProfileItem("Contact", visitor?.visitor_info?.contact, <Phone className="w-4 h-4" />)}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-red-500 text-white text-sm transition hover:bg-red-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewUserInfo;
