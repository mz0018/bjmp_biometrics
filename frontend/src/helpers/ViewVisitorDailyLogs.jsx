import { useState, useEffect } from "react";
import axios from "axios";

const ViewVisitorDailyLogs = ({ visitor }) => {
    const [list, setList] = useState([]);
    const visitor_id = visitor?.visitor_id;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/admin/visitoractivitylogs/${visitor_id}`
                );

                setList(res.data.logs || []);
            } catch (error) {
                console.error("Error fetching daily logs:", error);
            }
        };

        if (visitor_id) fetchLogs();

    }, [visitor_id]);

    return (
        <div className="p-4">
            <h1 className="font-bold text-lg">Activity Log</h1>

            {list.length === 0 ? (
                <p className="text-gray-500 mt-3">No logs found.</p>
            ) : (
                <ul className="mt-3 space-y-2">
                    {list.map((log, index) => (
                        <li key={index} className="border p-3 rounded bg-gray-50">
                            {log.activity}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewVisitorDailyLogs;
