import { useState } from "react";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ duration: 3000, position: { x: "right", y: "top" }, dismissible: true });

const usePersonalDetails = ({ admin }) => {
  const [loading, setLoading] = useState(false);
  const [forceLogout, setForceLogout] = useState(false);
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);

  const isGoogleAdmin = !!admin.googleId;
  const fields = isGoogleAdmin
    ? [
        { id: "userId", title: "Account Id", value: admin.id },
        { id: "firstName", title: "First name", value: admin.first_name },
        { id: "lastName", title: "Last name", value: admin.last_name },
        { id: "email", title: "Email", value: admin.email },
      ]
    : [
        { id: "userId", title: "Account Id", value: admin.id },
        { id: "firstName", title: "First name", value: admin.first_name },
        { id: "lastName", title: "Last name", value: admin.last_name },
        { id: "username", title: "Username", value: admin.username },
      ];

  const initialValues = fields.reduce((obj, field) => ({ ...obj, [field.id]: field.value }), {});
  const [formValues, setFormValues] = useState(initialValues);
  const [dirtyFields, setDirtyFields] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
    setDirtyFields((prev) => ({ ...prev, [id]: value !== initialValues[id] }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validate = (data) => {
    const newErrors = {};
    Object.entries(data).forEach(([key, value]) => {
      const trimmed = value.trim();
      if (!trimmed) newErrors[key] = `${key} cannot be empty`;
      else if (trimmed.length < 3) newErrors[key] = `${key} must be at least 3 characters`;
      else if (trimmed.length > 50) newErrors[key] = `${key} must be less than 50 characters`;
      if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) newErrors[key] = "Invalid email format";
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = Object.fromEntries(
        Object.entries(dirtyFields)
        .filter(([key, dirty]) => dirty)
        .map(([key]) => [key, formValues[key]])
    );

    if (!Object.keys(updatedData).length) {
        notyf.error("No changes to save");  
        return;
    }

    const validationErrors = validate(updatedData);
    if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        return;
    }

    try {
        setLoading(true);
        await axios.patch(`${import.meta.env.VITE_API_URL}/admin/update/${admin.id}`, updatedData);

        notyf.success("Personal details updated successfully");

        if (updatedData.username) setForceLogout(true);
        else {
        setFormValues((prev) => ({ ...prev, ...updatedData }));
        setDirtyFields({});
        setDisabled(true);
        }
    } catch (err) {
        console.error(err);
        notyf.error(err?.response?.data?.error || "Failed to update details");
    } finally {
        setLoading(false);
    }
    };

  return {
    isGoogleAdmin,
    fields,
    disabled,
    setDisabled,
    formValues,
    handleChange,
    handleSubmit,
    loading,
    dirtyFields,
    forceLogout,
    errors,
  };
};

export default usePersonalDetails;
