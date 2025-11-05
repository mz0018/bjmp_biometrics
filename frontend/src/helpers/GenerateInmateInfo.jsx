import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";

const GenerateInmateInfo = ({ inmate }) => {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inmate Info");

    // 🧾 Title row
    worksheet.mergeCells("A1", "B1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Inmate Record";
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: "center" };

    // 🧱 Table header row
    worksheet.addRow(["Field", "Value"]);
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    // 🧩 Add inmate data rows (key/value pairs)
    Object.entries(inmate).forEach(([key, value]) => {
      worksheet.addRow([key, value ?? ""]);
    });

    // 🎨 Style: auto width, borders
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 10;
        if (cellLength > maxLength) maxLength = cellLength;
      });
      column.width = maxLength < 15 ? 15 : maxLength;
    });

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // 🕒 Footer row
    const lastRow = worksheet.addRow([]);
    worksheet.mergeCells(`A${lastRow.number + 1}:B${lastRow.number + 1}`);
    const footerCell = worksheet.getCell(`A${lastRow.number + 1}`);
    footerCell.value = `Generated on ${new Date().toLocaleString()}`;
    footerCell.alignment = { horizontal: "right", italic: true };

    // 💾 Generate and download
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${inmate.name?.replace(/\s+/g, "_") || "inmate"}_record.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-[#0B6E4F] hover:bg-green-700 text-white px-4 py-2 rounded-sm flex items-center gap-2 cursor-pointer transition"
    >
      <FileSpreadsheet className="w-4 h-4" />
      <span>Export to Excel</span>
    </button>
  );
};

export default GenerateInmateInfo;
