import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleButton = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/google-signin`, { idToken });

      localStorage.setItem("admin", JSON.stringify(response.data.data));

      navigate("/protectedRoute/visitors-log");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <button
    onClick={handleGoogleSignIn}
    className="flex items-center justify-center gap-3 w-full max-w-sm px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition-colors"
    >
    <img
        src="/img/gmail.webp"
        alt="Google logo"
        className="w-5 h-5 cursor-pointer"
    />
    <span className="font-medium">Continue with Google</span>
    </button>
  );
};

export default GoogleButton;
