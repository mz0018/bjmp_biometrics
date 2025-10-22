import { useState } from "react";

const ButtonUpdate = ({ id, userType }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showId = () => {
        console.log(id, userType);
    }

    return (
        <button className="bg-green-500 p-4 rounded-sm text-white" onClick={() => showId()}>Update</button>
    )
}

export default ButtonUpdate;