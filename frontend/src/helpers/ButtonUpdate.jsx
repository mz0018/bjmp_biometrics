import { useState, useEffect } from "react";
import { X, Loader2, SquarePen } from "lucide-react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import useButtonUpdate from "../hooks/useButtonUpdate";
import {
  User,
  MapPin,
  Phone,
  FileText,
  Fingerprint,
  AlertTriangle,
} from "lucide-react";

const inmateFields = [
  "firstname", "lastname", "middleInitial", "gender", "dateOfBirth", "nationality",
  "address", "civilStatus", "height", "weight", "caseNumber", "offense", "sentence",
  "courtName", "arrestDate", "commitmentDate", "status", "remarks",
];

const visitorFields = ["visitor_id", "name", "address", "contact", "inmate"];

const disabledFields = {
  visitor: ["visitor_id", "inmate"],
  inmate: ["gender", "caseNumber"],
};

const notyf = new Notyf({
  position: { x: "right", y: "top" },
});

const ButtonUpdate = ({ userType, inmate, visitor }) => {
  const recordId = userType === "visitor" ? visitor?._id : inmate?._id;

  const getIconForField = (field) => {
    if (field.toLowerCase().includes("name")) return <User className="w-4 h-4" />;
    if (field.toLowerCase().includes("address")) return <MapPin className="w-4 h-4" />;
    if (field.toLowerCase().includes("contact")) return <Phone className="w-4 h-4" />;
    if (field.toLowerCase().includes("visitor_id") || field.toLowerCase().includes("case"))
      return <Fingerprint className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return isNaN(date)
      ? d
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
  };

  const initialFormData =
    userType === "visitor"
      ? {
          visitor_id: visitor?.visitor_id || "",
          name: visitor?.visitor_info?.name || "",
          address: visitor?.visitor_info?.address || "",
          contact: visitor?.visitor_info?.contact || "",
          inmate: visitor?.visitor_info?.selected_inmate?.inmate_name || "",
        }
      : inmate || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [dirtyFields, setDirtyFields] = useState({});
  const { findAndUpdate } = useButtonUpdate(userType, inmate, visitor);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [missingFields, setMissingFields] = useState({});

  useEffect(() => {
    if (userType === "visitor") {
      setFormData({
        visitor_id: visitor?.visitor_id || "",
        name: visitor?.visitor_info?.name || "",
        address: visitor?.visitor_info?.address || "",
        contact: visitor?.visitor_info?.contact || "",
        inmate: visitor?.selected_inmate?.inmate_name || "",
      });
    } else {
      setFormData(inmate || {});
    }
  }, [inmate, visitor, userType]);

  const handleOpen = () => {
    if (isSaving) return;
    if (userType === "visitor") {
      setFormData({
        visitor_id: visitor?.visitor_id || "",
        name: visitor?.visitor_info?.name || "",
        address: visitor?.visitor_info?.address || "",
        contact: visitor?.visitor_info?.contact || "",
        inmate: visitor?.selected_inmate?.inmate_name || "",
      });
    } else {
      setFormData(inmate || {});
    }
    setDirtyFields({});
    setMissingFields({});
    setIsModalOpen(true);
  };

  const handleClose = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value && missingFields[name]) {
      const copy = { ...missingFields };
      delete copy[name];
      setMissingFields(copy);
    }

    if (value !== (userType === "visitor" ? visitor?.visitor_info?.[name] : inmate?.[name])) {
      setDirtyFields((prev) => ({ ...prev, [name]: value }));
    } else {
      const newDirty = { ...dirtyFields };
      delete newDirty[name];
      setDirtyFields(newDirty);
    }
  };

  useEffect(() => {
    setIsChanged(Object.keys(dirtyFields).length === 0);
  }, [dirtyFields]);

  const formatFieldLabel = (f) => {
    const withSpaces = f.replace(/_/g, " ").replace(/([A-Z])/g, " $1");
    const trimmed = withSpaces.replace(/\s+/g, " ").trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  const handleSave = async () => {
    try {
      const emptyFields = {};
      const fields = userType === "visitor" ? visitorFields : inmateFields;
      fields.forEach((field) => {
        const val = formData[field];
        if (val === undefined || val === null || val.toString().trim() === "") {
          emptyFields[field] = true;
        }
      });

      if (Object.keys(emptyFields).length > 0) {
        setMissingFields(emptyFields);
        notyf.error("Please fill the highlighted fields.");
        return;
      }

      setMissingFields({});

      if (isChanged) {
        notyf.open({ type: "info", message: "No changes made." });
        return;
      }

      const updatePayload = dirtyFields;
      setIsSaving(true);

      await findAndUpdate(updatePayload);

      notyf.success("Updated successfully!");
      setIsModalOpen(false);
      setDirtyFields({});
    } catch (err) {
      console.error(err);
      notyf.error("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const fields = userType === "visitor" ? visitorFields : inmateFields;

  return (
    <>
      <button
        className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-sm flex items-center gap-2 cursor-pointer transition"
        onClick={handleOpen}
        disabled={isSaving}
        aria-disabled={isSaving}
        title={isSaving ? "Saving..." : "Update"}
      >
        {isSaving ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <SquarePen className="w-4 h-4" />
        )}
        Edit
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div
            className={`rounded-md shadow-lg w-full max-h-[90vh] ${
              userType === "visitor" ? "max-w-md" : "max-w-xl"
            } flex flex-col`}
          >
            <div className="bg-[#232023] px-4 py-4 sm:px-6 sm:py-5 rounded-t-md shadow-md sticky top-0 z-10 flex justify-between items-center">
              <h2 className="text-left text-lg sm:text-xl font-semibold text-white">
                Update Information
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 transition"
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
              {userType === "inmate" && (
                <div className="flex justify-center mb-4 px-2">
                  <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-md flex items-center gap-3 max-w-full sm:max-w-[900px]">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-xs sm:text-sm leading-snug m-0">
                      <strong>Warning:</strong> This section contains confidential information.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm text-gray-700">
                {fields.map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="font-semibold capitalize text-left text-xs sm:text-sm mb-1">
                      {formatFieldLabel(field)}
                    </label>

                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {getIconForField(field)}
                      </span>

                      <input
                        type="text"
                        name={field}
                        value={
                          ["dateOfBirth", "arrestDate", "commitmentDate"].includes(field)
                            ? formatDate(formData[field])
                            : formData[field] || ""
                        }
                        onChange={handleChange}
                        disabled={isSaving || disabledFields[userType]?.includes(field)}
                        className={`border px-8 py-2 rounded-md w-full disabled:text-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          missingFields[field]
                            ? "border-red-500"
                            : dirtyFields[field]
                            ? "border-yellow-400"
                            : "border-gray-300"
                        }`}
                      />
                    </div>

                    {missingFields[field] && (
                      <p className="text-red-500 text-xs mt-1">
                        {formatFieldLabel(field)} is empty
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#232023] px-4 py-3 rounded-b-md flex flex-col items-end justify-center text-center space-y-1">
              <button
                disabled={isChanged || isSaving}
                onClick={handleSave}
                className={`bg-[#002868] text-white px-4 py-2 rounded-sm ${
                  isChanged || isSaving
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-blue-900"
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonUpdate;
