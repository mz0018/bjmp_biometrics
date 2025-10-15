import { useState } from "react";

const useInmateRegistration = () => {
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

  const handleInmateRegistration = (e) => {
    e.preventDefault();

    const formToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formToSubmit.append(key, value);
    });

    for (let pair of formToSubmit.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

  };

  return { handleInmateRegistration, formData, handleChange };
};

export default useInmateRegistration;
