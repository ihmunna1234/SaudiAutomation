import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { tools } from "../config/tools";
import { Construction } from "lucide-react";

export default function ComingSoon() {
  const { pathname } = useLocation();
  const tool = tools.find((t) => t.path === pathname);

  return (
    <AppShell title={tool?.name ?? "Coming soon"} subtitle="This tool is not ready yet">
      <div className="glass-effect rounded-3xl border border-slate-200 p-10 text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
          <Construction className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Under development</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          {tool?.description ?? "This tool will be available in a future update."}
        </p>
        <Link
          to="/"
          className="inline-block mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to all tools
        </Link>
      </div>
    </AppShell>
  );
}
