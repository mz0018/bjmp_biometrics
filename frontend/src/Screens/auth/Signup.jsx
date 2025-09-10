import useSignupAdmin from "../../hooks/useSignupAdmin"
const Signup = () => {
    const { formData, handleChange, handleSubmit, isLoading, errors } = useSignupAdmin();

  return (
    <>
      <h1>Signup Admin</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        
        <div>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First name"
            className={`border p-2 w-full rounded ${errors.first_name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
        </div>

        <div>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last name"
            className={`border p-2 w-full rounded ${errors.last_name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
        </div>

        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username here"
            className={`border p-2 w-full rounded ${errors.username ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password here"
            className={`border p-2 w-full rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div>
          <input
            type="password"
            name="retype_password"
            value={formData.retype_password}
            onChange={handleChange}
            placeholder="Retype password"
            className={`border p-2 w-full rounded ${errors.retype_password ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.retype_password && <p className="text-red-500 text-sm">{errors.retype_password}</p>}
        </div>

        {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Signup"}
        </button>
      </form>
    </>
  );
}

export default Signup