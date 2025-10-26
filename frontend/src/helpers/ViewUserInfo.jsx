import { useState } from "react";
import { UserRoundCog } from "lucide-react";

const ViewUserInfo = ({ userType, inmate, visitor }) => {
  const showInfo = () => {
    console.log(userType);
  };

  return (
    <button
      className="bg-[#002868] hover:bg-blue-900 text-white px-4 py-2 rounded-sm flex items-center gap-2 cursor-pointer transition-colors"
      onClick={showInfo}
    >
      <UserRoundCog className="w-4 h-4 text-white" />
        View
    </button>
  );
};

export default ViewUserInfo;
