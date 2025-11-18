import { useState } from "react";
import axios from "axios";

import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ duration: 5000, position: { x: "right", y: "top" } });

const usePasswordSecurity = ({ admin }) => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    retypeNewPassword: "",
  });

  const [visible, setVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleVisibility = (key) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFieldErrors({});

    const newErrors = {};

    if (!data.oldPassword) newErrors.oldPassword = "Current password is required";
    if (!data.newPassword) newErrors.newPassword = "New password is required";
    if (!data.retypeNewPassword)
      newErrors.retypeNewPassword = "Please confirm your new password";

    if (data.newPassword && data.newPassword.length < 8)
      newErrors.newPassword = "New password must be at least 8 characters long";

    if (
      data.newPassword &&
      data.retypeNewPassword &&
      data.newPassword !== data.retypeNewPassword
    )
      newErrors.retypeNewPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      return setFieldErrors(newErrors);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/confirm/${admin.id}`,
        {
          currentPassword: data.oldPassword,
          newPassword: data.newPassword,
        }
      );

      console.log("Response Data: ", res.data);

      notyf.success("Password changed successfully!");
      setData({ oldPassword: "", newPassword: "", retypeNewPassword: "" });
    } catch (err) {
      if (err.response?.status === 429) {
        setFieldErrors({ general: err.response.data.error || "Too many attempts. Try again later." });
      } else if (err.response?.data) {
        const { field, error } = err.response.data;
        if (field && error) {
          setFieldErrors({ [field]: error });
        } else {
          setFieldErrors({
            oldPassword: err.response.data.error || "Failed to change password",
          });
        }
      } else {
        setFieldErrors({ general: "Network error, please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    {
      id: "current-password",
      key: "current",
      name: "oldPassword",
      label: "Current password",
      placeholder: "Enter your existing password",
      helper: "Used to verify your identity before changing it.",
    },
    {
      id: "new-password",
      key: "new",
      name: "newPassword",
      label: "New password",
      placeholder: "Create a strong new password",
      helper: "At least 8 characters with a mix of numbers and symbols.",
    },
    {
      id: "confirm-password",
      key: "confirm",
      name: "retypeNewPassword",
      label: "Re-type password",
      placeholder: "Re-enter your new password",
      helper: "Must match the new password above.",
    },
  ];

  return {
    data,
    visible,
    loading,
    fieldErrors,
    inputs,
    handleChange,
    toggleVisibility,
    handleSubmit,
  };
};

export default usePasswordSecurity;
