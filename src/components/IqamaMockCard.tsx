import React from "react";
import { CreditCard, Shield, Landmark, User, Calendar, Briefcase, FileText, CheckCircle } from "lucide-react";
import { IqamaData } from "../types";

interface IqamaMockCardProps {
  data: IqamaData;
}

export const IqamaMockCard: React.FC<IqamaMockCardProps> = ({ data }) => {
  // Format Iqama ID with custom spacing (e.g., 2 345 678 901)
  const formatIqamaId = (id: string) => {
    if (!id) return "– – – – – – – – – ";
    const clean = id.replace(/\s+/g, "");
    if (clean.length === 10) {
      return `${clean.substring(0, 1)} ${clean.substring(1, 4)} ${clean.substring(4, 7)} ${clean.substring(7)}`;
    }
    return clean;
  };

  return (
    <div className="relative overflow-hidden w-full max-w-lg mx-auto rounded-2xl shadow-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white font-sans transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl">
      {/* Graphic background highlights representing security marks */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 px-6 pt-5 pb-3 border-b border-white/10 flex items-start justify-between">
        <div>
          <span className="text-[10px] tracking-widest text-emerald-400 font-semibold block uppercase">
            Kingdom of Saudi Arabia
          </span>
          <span className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
            Resident Permit
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] tracking-widest text-emerald-400 font-semibold block font-mono">
            المملكة العربية السعودية
          </span>
          <span className="text-xs font-semibold text-emerald-300 block font-sans">
            هوية مقيم / إقامة
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="relative z-10 p-6 flex flex-col md:flex-row gap-5">
        {/* Left Column: Avatar & ID */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-28 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-inner">
              <User className="w-16 h-16 text-emerald-500/50" />
            </div>
            {/* Holographic Security Overlay */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-emerald-500/0 via-amber-500/10 to-emerald-500/0 pointer-events-none mix-blend-overlay" />
            {/* Status indicator badge */}
            <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <Shield className="w-3 h-3" />
              <span>ACTIVE</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
              Iqama Number / رقم الإقامة
            </span>
            <span className="text-lg font-bold font-mono tracking-wider text-amber-300">
              {formatIqamaId(data.iqamaNumber)}
            </span>
          </div>
        </div>

        {/* Right Column: User Details */}
        <div className="flex-1 space-y-3.5">
          {/* Names */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Full Name (Latin)</span>
              <span>الاسم الكامل</span>
            </div>
            <div className="text-emerald-50 font-bold tracking-wide uppercase text-sm leading-tight max-w-xs">
              {data.nameEnglish || "N/A"}
            </div>
            <div className="text-amber-200/90 font-medium text-base text-right font-sans leading-tight mt-0.5">
              {data.nameArabic || "لا يوجد"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1 border-t border-white/5">
            {/* Nationality */}
            <div>
              <div className="text-[9px] text-slate-400 flex justify-between">
                <span>Nationality</span>
                <span>الجنسية</span>
              </div>
              <span className="text-xs font-semibold text-slate-100">{data.nationality || "N/A"}</span>
            </div>

            {/* Profession */}
            <div>
              <div className="text-[9px] text-slate-400 flex justify-between">
                <span>Job/Profession</span>
                <span>المهنة</span>
              </div>
              <span className="text-xs font-semibold text-slate-100 truncate block">{data.occupation || "N/A"}</span>
            </div>

            {/* Expire Date */}
            <div>
              <div className="text-[9px] text-slate-400 flex justify-between">
                <span>Expiry Date</span>
                <span>تاريخ الانتهاء</span>
              </div>
              <div className="flex flex-col text-xs font-semibold text-slate-100">
                <span>{data.expiryDateGregorian || "N/A"}</span>
                {data.expiryDateHijri && (
                  <span className="text-[10px] text-amber-200/80 font-mono italic">
                    {data.expiryDateHijri} H
                  </span>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <div className="text-[9px] text-slate-400 flex justify-between">
                <span>Date of Birth</span>
                <span>تاريخ الميلاد</span>
              </div>
              <div className="flex flex-col text-xs font-semibold text-slate-100">
                <span>{data.dateOfBirthGregorian || "N/A"}</span>
                {data.dateOfBirthHijri && (
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {data.dateOfBirthHijri} H
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sponsor name */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[9px] text-slate-400 flex justify-between">
              <span>Employer / Sponsor Name</span>
              <span>صاحب العمل / الكفيل</span>
            </span>
            <span className="text-xs font-semibold text-amber-100 block truncate">
              {data.sponsorName || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-2.5 bg-slate-950/70 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
        <div className="flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5" />
          <span>Jawazat Automated System</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span>Verified AI-OCR</span>
        </div>
      </div>
    </div>
  );
};
