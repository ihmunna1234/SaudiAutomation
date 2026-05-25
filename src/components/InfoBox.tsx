import React from "react";
import { ShieldAlert, Server, Lock } from "lucide-react";

export const InfoBox: React.FC = () => {
  return (
    <div className="w-full glass-effect rounded-2xl border border-blue-500/10 p-4 bg-gradient-to-r from-blue-50/30 to-indigo-50/10 shadow-sm flex items-start gap-3">
      <div className="p-2 bg-blue-500/10 rounded-xl text-indigo-600 border border-blue-500/20">
        <Lock className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs font-semibold text-slate-800 leading-snug">
          Secure End-to-End Processing
        </h4>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
          Upload 1–200 Iqamas at once. Each record gets a SL NO plus English/Arabic name, Iqama No, BOD, and Expire Date — then download everything as an Excel file. Images are processed in memory only and not stored.
        </p>
      </div>
    </div>
  );
};
