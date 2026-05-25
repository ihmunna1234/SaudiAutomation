import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LayoutGrid } from "lucide-react";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  title,
  subtitle,
  children,
  headerRight,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-8 px-4 md:px-8">
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="shrink-0 w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
            title="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <Link
              to="/"
              className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase hover:text-indigo-600 flex items-center gap-1"
            >
              <LayoutGrid className="w-3 h-3" />
              Injamul's Automation
            </Link>
            <h1 className="text-sm font-bold text-slate-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {headerRight}
      </header>

      <main className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center">
        {children}
      </main>

      <footer className="w-full max-w-md mx-auto text-center text-[10px] text-slate-400 mt-10 pt-5 border-t border-slate-100">
        © 2026 Injamul's Automation Toolkit
      </footer>
    </div>
  );
};
