import { Printer } from "lucide-react";

const GenerateInmateInfo = ({ inmate }) => {
  const show = () => {
    console.table(inmate);
  };

  return (
    <button
      onClick={show}
      className="bg-[#002868] hover:bg-blue-900 text-white px-4 py-2 rounded-sm flex items-center gap-2 cursor-pointer transition"
    >
      <Printer className="w-4 h-4" />
      <span>Print Document</span>
    </button>
  );
};

export default GenerateInmateInfo;
