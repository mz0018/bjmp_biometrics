import { useState } from "react";
import axios from "axios";

const useInmateRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState({});
  const [formData, setFormData] = useState({
    firstname: "",
    middleInitial: "",
    lastname: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    civilStatus: "",
    height: "",
    weight: "",
    caseNumber: "",
    offense: "",
    sentence: "",
    courtName: "",
    arrestDate: "",
    commitmentDate: "",
    status: "",
    remarks: "",
    mugshot_front: null,
    mugshot_left: null,
    mugshot_right: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      firstname: "",
      middleInitial: "",
      lastname: "",
      gender: "",
      dateOfBirth: "",
      nationality: "",
      address: "",
      civilStatus: "",
      height: "",
      weight: "",
      caseNumber: "",
      offense: "",
      sentence: "",
      courtName: "",
      arrestDate: "",
      commitmentDate: "",
      status: "",
      remarks: "",
      mugshot_front: null,
      mugshot_left: null,
      mugshot_right: null,
    }),
    setHasError({});
  }

  const handleInmateRegistration = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/inmates`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      resetForm();
    } catch (error) {
      if (error.response?.data?.errors) {
        setHasError(error.response.data.errors);
      } else {
        setHasError({ general: "Something went wrong, please try again." });
      }
    } finally {
      setLoading(false);
    }

  };

  return { handleInmateRegistration, formData, handleChange, loading, hasError};
};

export default useInmateRegistration;
