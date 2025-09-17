import { Link } from "react-router-dom";
import { GlobalContext } from "./context/GlobalContext";
import { useContext } from "react";

const App = () => {
  const { value } = useContext(GlobalContext);

  console.log(value);

  return (
    <div className="flex gap-4">
      <Link 
        to="/verification" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Open Verification Camera
      </Link>

      <Link 
        to="/admin" 
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Go to Admin Dashboard
      </Link>
    </div>
  );
};

export default App;
