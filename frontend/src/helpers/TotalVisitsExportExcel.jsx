import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

const TotalVisitsExportExcel = ({ visitLogs }) => {

    const handleExport = () => {
        const formattedLogs = visitLogs.map(vl => ({
            "Inmate Name": vl.selected_inmate?.inmate_name || "N/A",
            "Visit Time": new Date(vl.timestamp).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedLogs, { origin: "A5" });

        worksheet["!cols"] = [
            { wch: 30 },
            { wch: 25 },
        ];

        worksheet["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
        ];

        worksheet["A1"] = { t: "s", v: "Visitor Report" };

        ["A5", "B5"].forEach((cell) => {
            if (worksheet[cell]) {
                worksheet[cell].s = {
                    font: { bold: true },
                    alignment: { horizontal: "center" },
                };
            }
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Visitor Report");

        XLSX.writeFile(workbook, "Visitor_Report.xlsx");
    };

    return (
        <button
            onClick={handleExport}
            className="bg-[#0B6E4F] hover:bg-green-700 text-white px-6 py-3 rounded-sm flex justify-center items-center gap-2 cursor-pointer transition w-full font-semibold"
        >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to Excel</span>
        </button>
    );
};

export default TotalVisitsExportExcel;
