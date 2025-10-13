import { useState } from "react";
import { Notyf } from "notyf";
import axios from "axios";
import * as XLSX from "xlsx";
import "notyf/notyf.min.css";

const notyf = new Notyf({
  duration: 2500,
  position: { x: "right", y: "top" },
});

const useGenerateReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const generateReport = async (fromDate, toDate, closeModal) => {
    if (!fromDate || !toDate) {
      setError(true);
      notyf.error("Please select both 'From' and 'To' dates.");
      return;
    }

    try {
      setError(false);
      setLoading(true);
      notyf.open({ type: "info", message: "Generating report..." });

       const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/generate`,
        { from: fromDate, to: toDate }
      );

      const data = response.data;

      if (data.success && data.data.length > 0) {
        const logs = data.data;

        const formattedLogs = logs.map((log) => ({
          "Visitor Name": log.visitor_info.name,
          Address: log.visitor_info.address,
          Contact: log.visitor_info.contact,
          "Inmate Name": log.selected_inmate?.inmate_name || "N/A",
          Relationship: log.selected_inmate?.relationship || "N/A",
          "Timestamp": new Date(log.timestamp).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedLogs);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        const fileName = `Visitor_Report_${fromDate}_to_${toDate}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        notyf.success("Excel report generated successfully!");
      } else {
        notyf.error(data.message || "No data found for selected range.");
      }
    } catch (err) {
      console.error("Report generation failed:", err);
      notyf.error("Failed to generate report.");
    } finally {
      setLoading(false);
      if (closeModal) closeModal();
    }
  };

  return { loading, error, setError, generateReport };
};

export default useGenerateReports;
