import { useState } from "react";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ duration: 5000, position: { x: "right", y: "top" } });

const useSignupAdmin = (setIsSignupOpen) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    retype_password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); 
  
  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      retype_password: ""
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/signup`,
        formData
      );
      notyf.success(response.data.message);
      setIsSignupOpen(prev => !prev);
      resetForm();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Something went wrong, please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    errors,
  };
};

export default useSignupAdmin;
