import { User, Lock } from "lucide-react";

const SignupFallback = () => {
  return (
    <div className="w-full max-w-xl p-6 flex flex-col gap-4 animate-pulse">
      <h1 className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></h1>
      <p className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* First Name */}
        <div className="relative h-10 bg-gray-300 rounded flex items-center px-3"></div>
        {/* Last Name */}
        <div className="relative h-10 bg-gray-300 rounded flex items-center px-3"></div>
      </div>

      {/* Username */}
      <div className="relative h-10 bg-gray-300 rounded flex items-center px-3 mt-3">
        <User className="text-gray-400 mr-2" size={18} />
      </div>

      {/* Password */}
      <div className="relative h-10 bg-gray-300 rounded flex items-center px-3 mt-3">
        <Lock className="text-gray-400 mr-2" size={18} />
      </div>

      {/* Retype Password */}
      <div className="relative h-10 bg-gray-300 rounded flex items-center px-3 mt-3"></div>

      {/* Submit Button */}
      <div className="h-10 bg-gray-400 rounded mt-4 w-full"></div>
    </div>
  );
};

export default SignupFallback;
