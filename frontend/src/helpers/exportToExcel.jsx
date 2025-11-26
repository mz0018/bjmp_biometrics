import * as XLSX from "xlsx";

const exportToExcel = (logs, fromDate, toDate) => {
  const formattedLogs = logs.map((log, index) => ({
    "No.": index + 1,
    "Visitor Name": log.visitor_info?.name || "N/A",
    "Address": log.visitor_info?.address || "N/A",
    "Contact": log.visitor_info?.contact || "N/A",
    "Inmate Name": log.selected_inmate?.inmate_name || "N/A",
    "Relationship": log.selected_inmate?.relationship || "N/A",
    "Date & Time": new Date(log.timestamp).toLocaleString(),
  }));

  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Visitor Logs Report"],
    [`Date Range: ${fromDate} to ${toDate}`],
    [],
    [
      "No.",
      "Visitor Name",
      "Address",
      "Contact",
      "Inmate Name",
      "Relationship",
      "Date & Time"
    ]
  ]);

  XLSX.utils.sheet_add_json(worksheet, formattedLogs, {
    origin: "A5",
    skipHeader: true,
  });

  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 25 },
  ];

  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
  ];

  const headerCells = ["A4", "B4", "C4", "D4", "E4", "F4", "G4"];
  headerCells.forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true },
        alignment: { horizontal: "center" },
      };
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Visitor Report");

  const fileName = `Visitor_Report_${fromDate}_to_${toDate}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export default exportToExcel;
