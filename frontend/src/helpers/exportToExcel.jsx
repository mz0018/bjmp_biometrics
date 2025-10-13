import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = (logs, fromDate, toDate) => {
  const formattedLogs = logs.map((log, index) => ({
    "No.": index + 1,
    "Visitor Name": log.visitor_info.name,
    "Address": log.visitor_info.address,
    "Contact": log.visitor_info.contact,
    "Inmate Name": log.selected_inmate?.inmate_name || "N/A",
    "Relationship": log.selected_inmate?.relationship || "N/A",
    "Date & Time": new Date(log.timestamp).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedLogs, {
    origin: "A5",
  });

  XLSX.utils.sheet_add_aoa(worksheet, [
    ["Visitor Logs Report"],
    [`Date Range: ${fromDate} to ${toDate}`],
    [],
  ], { origin: "A1" });

  worksheet["!cols"] = [
    { wch: 5 },   
    { wch: 20 },  
    { wch: 25 },  
    { wch: 15 },  
    { wch: 20 }, 
    { wch: 15 }, 
    { wch: 25 },  
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Visitor Report");

  const headerCells = ["A5", "B5", "C5", "D5", "E5", "F5", "G5"];
  headerCells.forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true },
        alignment: { horizontal: "center" },
      };
    }
  });

  const fileName = `Visitor_Report_${fromDate}_to_${toDate}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export default exportToExcel;