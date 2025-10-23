import { useState, useEffect } from "react";
import { X } from "lucide-react";
import useButtonUpdate from "../hooks/useButtonUpdate";

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
  "caseNumber",
  "offense",
  "sentence",
  "courtName",
  "arrestDate",
  "commitmentDate",
  "status",
  "remarks",
];

const visitorFields = ["visitor_id", "name", "address", "contact", "inmate"];

const ButtonUpdate = ({ id, userType, inmate, visitor }) => {

  // console.log("Check Visitors: ", JSON.stringify(visitor, null, 2));

  const initialFormData = userType === "visitor" 
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
  const { findAndUpdate } = useButtonUpdate(id);
  const [isChanged, setIsChanged] = useState(false);

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
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

  const handleSave = async () => {
    try {
      if (isChanged) {
        alert("No changes made.");
        return;
      }

      const updatePayload = userType === "visitor" ? { visitor: dirtyFields } : dirtyFields;

      await findAndUpdate(updatePayload);
      alert("Updated successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  const fields = userType === "visitor" ? visitorFields : inmateFields;

  return (
    <>
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm"
        onClick={handleOpen}
      >
        Update
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Update Info</h2>
              <button onClick={handleClose}>
                <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700 max-h-[70vh] overflow-y-auto">
              {fields.map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="font-semibold capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className={`border px-2 py-1 rounded-sm ${
                      dirtyFields[field] ? "border-yellow-400" : "border-gray-300"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleClose}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-sm"
              >
                Close
              </button>

              <button
                disabled={isChanged}
                onClick={handleSave}
                className={`bg-blue-500 text-white px-4 py-2 rounded-sm ${
                  isChanged ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-blue-600"
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonUpdate;
