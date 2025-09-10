import useSigninAdmin from "../../hooks/useSigninAdmin";

const Signin = () => {
  const { formData, handleChange, handleSubmit, isLoading, errors } = useSigninAdmin();

  return (
    <>
      <h1>Admin Signin</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        
        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
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
            placeholder="Password"
            className={`border p-2 w-full rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Signin"}
        </button>
      </form>
    </>
  );
};

export default Signin;
