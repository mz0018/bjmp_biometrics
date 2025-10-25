import { useState } from "react";

const ViewUserInfo = ({ userType, inmate, visitor }) => {

    const showInfo = () => {
        console.log(userType);
    }

    return (
        <>
        <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm flex items-center gap-2"
        onClick={() => showInfo()}
        >
            View User
        </button>
        </>
    )
}

export default ViewUserInfo;