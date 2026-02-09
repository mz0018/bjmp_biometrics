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
  "firstname",
  "lastname",
  "middleInitial",
  "gender",
  "dateOfBirth",
  "nationality",
  "address",
  "civilStatus",
  "height",
  "weight",
];

const visitorFields = ["visitor_id", "name", "address", "contact", "inmate"];

const disabledFields = {
  visitor: ["visitor_id", "inmate"],
  inmate: ["gender"],
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
    if (field.toLowerCase().includes("visitor_id"))
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
        if (!val || val.toString().trim() === "") emptyFields[field] = true;
      });

      if (Object.keys(emptyFields).length > 0) {
        setMissingFields(emptyFields);
        notyf.error("Please fill the highlighted fields.");
        return;
      }

      if (isChanged) {
        notyf.open({ type: "info", message: "No changes made." });
        return;
      }

      setIsSaving(true);
      await findAndUpdate(dirtyFields);

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
    return () => (document.body.style.overflow = "auto");
  }, [isModalOpen]);

  const fields = userType === "visitor" ? visitorFields : inmateFields;

  return (
    <>
      <button
        className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-sm flex items-center gap-2 cursor-pointer transition"
        onClick={handleOpen}
        disabled={isSaving}
        aria-label="Edit user information"
        title="Edit user information"
      >
        {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <SquarePen className="w-5 h-5" />}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-h-[90vh] ${
              userType === "visitor" ? "max-w-md" : "max-w-xl"
            } bg-white rounded-md shadow-lg flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-4 border-b border-gray-200 shadow-sm">
              <div className="flex flex-col text-start">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight mb-1">
                  Update {userType === "inmate" ? "Inmate" : "Visitor"} Information
                </h2>
                <p className="text-gray-600 text-sm leading-snug">
                  Modify the fields below and save your changes.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-grow max-h-[70vh] p-4 sm:p-6">
              {userType === "inmate" && (
                <div className="flex justify-center mb-4 px-2">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded flex items-start gap-3 max-w-md w-full">
                    <AlertTriangle className="w-5 h-5 mt-1 text-yellow-600" />
                    <p className="text-sm">
                      <strong>Warning:</strong> Editing inmate records should be done carefully.
                    </p>
                  </div>
                </div>
              )}

              {/* Personal Information Table */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Personal Information</h3>
                <table className="table-auto w-full text-sm border border-gray-200">
                  <tbody>
                    {fields
                      .filter((f) =>
                        userType === "inmate"
                          ? [
                              "firstname",
                              "lastname",
                              "middleInitial",
                              "gender",
                              "dateOfBirth",
                              "nationality",
                              "address",
                              "civilStatus",
                              "height",
                              "weight",
                            ].includes(f)
                          : ["visitor_id", "name", "address", "contact"].includes(f)
                      )
                      .map((field) => (
                        <tr key={field} className="border-b border-gray-200">
                          <td className="font-semibold px-3 py-2 w-1/3">{formatFieldLabel(field)}</td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              name={field}
                              value={
                                ["dateOfBirth"].includes(field)
                                  ? formatDate(formData[field])
                                  : formData[field] || ""
                              }
                              onChange={handleChange}
                              disabled={isSaving || disabledFields[userType]?.includes(field)}
                              className={`border px-2 py-1 rounded-md w-full ${
                                missingFields[field]
                                  ? "border-red-500"
                                  : dirtyFields[field]
                                  ? "border-yellow-400"
                                  : "border-gray-300"
                              }`}
                            />
                            {missingFields[field] && (
                              <p className="text-red-500 text-xs mt-1">{formatFieldLabel(field)} is required</p>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-3 flex justify-end gap-1">
              <button
                className="border border-gray-300 hover:bg-gray-50 text-gray-500 font-semibold px-6 py-3 rounded-sm text-sm transition w-full cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                disabled={isChanged || isSaving}
                onClick={handleSave}
                className={`bg-blue-900 text-white px-4 py-2 rounded-sm w-full ${
                  isChanged || isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800"
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
