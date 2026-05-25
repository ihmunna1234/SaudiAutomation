import * as XLSX from "xlsx";
import { BatchItemResult } from "../types";

const HEADERS = [
  "SL NO",
  "Name (English)",
  "Name (Arabic)",
  "Iqama No",
  "BOD",
  "Expire Date",
];

export function downloadIqamaExcel(results: BatchItemResult[], fileName?: string) {
  const rows = results
    .filter((r) => r.status === "success" && r.data)
    .map((r) => [
      r.data!.slNo,
      r.data!.nameEnglish,
      r.data!.nameArabic,
      r.data!.iqamaNo,
      r.data!.bod,
      r.data!.expireDate,
    ]);

  if (rows.length === 0) return false;

  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Iqama Data");

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, fileName || `iqama-data-${date}.xlsx`);
  return true;
}
