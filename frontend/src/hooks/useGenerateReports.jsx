import { useState } from "react";
import { Notyf } from "notyf";
import axios from "axios";
import "notyf/notyf.min.css";
import exportToExcel from "../helpers/exportToExcel";

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
        exportToExcel(logs, fromDate, toDate);
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
