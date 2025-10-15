import useInmateRegistration from "../hooks/useInmateRegistration";

const InmateRegistration = () => {
  const { handleInmateRegistration, formData, handleChange } = useInmateRegistration();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleInmateRegistration}
        encType="multipart/form-data"
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Inmate Registration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded w-full" type="text" name="firstname" placeholder="Firstname" onChange={handleChange} value={formData.firstname} />
          <input className="border p-2 rounded w-full" type="text" name="middleInitial" placeholder="Middle Initial" onChange={handleChange} value={formData.middleInitial} />
          <input className="border p-2 rounded w-full" type="text" name="lastname" placeholder="Lastname" onChange={handleChange} value={formData.lastname} />
          <input className="border p-2 rounded w-full" type="text" name="gender" placeholder="Gender" onChange={handleChange} value={formData.gender} />

          <input className="border p-2 rounded w-full" type="date" name="dateOfBirth" placeholder="Date of Birth" onChange={handleChange} value={formData.dateOfBirth} />
          <input className="border p-2 rounded w-full" type="text" name="nationality" placeholder="Nationality" onChange={handleChange} value={formData.nationality} />
          <input className="border p-2 rounded w-full" type="text" name="address" placeholder="Address" onChange={handleChange} value={formData.address} />
          <input className="border p-2 rounded w-full" type="text" name="civilStatus" placeholder="Civil Status" onChange={handleChange} value={formData.civilStatus} />

          <input className="border p-2 rounded w-full" type="text" name="height" placeholder="Height" onChange={handleChange} value={formData.height} />
          <input className="border p-2 rounded w-full" type="text" name="weight" placeholder="Weight" onChange={handleChange} value={formData.weight} />

          <input className="border p-2 rounded w-full" type="text" name="caseNumber" placeholder="Case Number" onChange={handleChange} value={formData.caseNumber} />
          <input className="border p-2 rounded w-full" type="text" name="offense" placeholder="Offense" onChange={handleChange} value={formData.offense} />
          <input className="border p-2 rounded w-full" type="text" name="sentence" placeholder="Sentence (e.g. 6 months imprisonment)" onChange={handleChange} value={formData.sentence} />
          <input className="border p-2 rounded w-full" type="text" name="courtName" placeholder="Court Handling the Case" onChange={handleChange} value={formData.courtName} />
          <input className="border p-2 rounded w-full" type="text" name="arrestDate" placeholder="Arrest Date" onChange={handleChange} value={formData.arrestDate} />
          <input className="border p-2 rounded w-full" type="text" name="commitmentDate" placeholder="Commitment Date" onChange={handleChange} value={formData.commitmentDate} />
          <input className="border p-2 rounded w-full" type="text" name="status" placeholder="Status (Detained, Released, Transferred)" onChange={handleChange} value={formData.status} />
          <input className="border p-2 rounded w-full" type="text" name="remarks" placeholder="Remarks" onChange={handleChange} value={formData.remarks} />
        </div>

        <div className="mt-6">
          <p className="font-medium text-gray-700 mb-2">Upload Mugshots (3 pictures)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex flex-col items-start">
              <span className="text-sm text-gray-600 mb-1">Front View</span>
              <input
                className="border p-2 rounded w-full"
                type="file"
                name="mugshot_front"
                accept="image/*"
                onChange={handleChange}
              />
            </label>

            <label className="flex flex-col items-start">
              <span className="text-sm text-gray-600 mb-1">Left View</span>
              <input
                className="border p-2 rounded w-full"
                type="file"
                name="mugshot_left"
                accept="image/*"
                onChange={handleChange}
              />
            </label>

            <label className="flex flex-col items-start">
              <span className="text-sm text-gray-600 mb-1">Right View</span>
              <input
                className="border p-2 rounded w-full"
                type="file"
                name="mugshot_right"
                accept="image/*"
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default InmateRegistration;
