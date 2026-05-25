import React from "react";
import { Check, RefreshCw, Download } from "lucide-react";
import { BatchResponse } from "../types";
import { ResultsTable } from "./ResultsTable";
import { downloadIqamaExcel } from "../utils/exportExcel";

interface ResultSectionProps {
  result: BatchResponse;
  onReset: () => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ result, onReset }) => {
  const results = result.results || [];
  const processed = result.totalProcessed ?? 0;
  const failed = result.totalFailed ?? 0;

  const handleDownload = () => {
    downloadIqamaExcel(results);
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-3xl border border-emerald-500/10 p-6 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />

        <div className="mx-auto w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-500/20">
          <Check className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-slate-900 font-bold text-lg">Extraction complete</h3>
          <p className="text-slate-500 text-xs">
            {processed} record{processed !== 1 ? "s" : ""} ready in Excel
            {failed > 0 ? ` (${failed} failed)` : ""}
          </p>
        </div>

        {processed > 0 && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <Download className="w-5 h-5" />
            Download Excel (.xlsx)
          </button>
        )}

        <button
          onClick={onReset}
          className="w-full max-w-xs mx-auto py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" /> Upload more Iqamas
        </button>
      </div>

      {results.length > 0 && <ResultsTable results={results} />}
    </div>
  );
};
