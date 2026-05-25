import React from "react";
import { BatchItemResult } from "../types";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ResultsTableProps {
  results: BatchItemResult[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-[11px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wide">
            <th className="px-3 py-2.5 font-semibold">SL NO</th>
            <th className="px-3 py-2.5 font-semibold">Name (English)</th>
            <th className="px-3 py-2.5 font-semibold">Name (Arabic)</th>
            <th className="px-3 py-2.5 font-semibold">Iqama No</th>
            <th className="px-3 py-2.5 font-semibold">BOD</th>
            <th className="px-3 py-2.5 font-semibold">Expire Date</th>
            <th className="px-3 py-2.5 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr
              key={r.slNo}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
            >
              <td className="px-3 py-2 font-mono font-semibold text-indigo-700">
                {r.slNo}
              </td>
              {r.status === "success" && r.data ? (
                <>
                  <td className="px-3 py-2 text-slate-800">{r.data.nameEnglish}</td>
                  <td className="px-3 py-2 text-slate-800 font-arabic" dir="rtl">
                    {r.data.nameArabic}
                  </td>
                  <td className="px-3 py-2 font-mono">{r.data.iqamaNo}</td>
                  <td className="px-3 py-2">{r.data.bod}</td>
                  <td className="px-3 py-2">{r.data.expireDate}</td>
                </>
              ) : (
                <td colSpan={5} className="px-3 py-2 text-rose-600">
                  {r.message || "Failed"}
                </td>
              )}
              <td className="px-3 py-2">
                {r.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
