import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { ToolDefinition, accentStyles } from "../config/tools";

interface ToolCardProps {
  tool: ToolDefinition;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const styles = accentStyles[tool.accent];
  const Icon = tool.icon;

  const content = (
    <div
      className={`group relative h-full rounded-2xl border p-5 transition-all duration-300 ${
        tool.available
          ? `bg-white hover:border-indigo-300 hover:shadow-xl ${styles.glow} cursor-pointer`
          : "bg-slate-50/80 border-slate-200 opacity-75 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${styles.bg}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {!tool.available && (
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
            <Lock className="w-3 h-3" />
            Soon
          </span>
        )}
      </div>

      <h3 className="mt-4 font-bold text-slate-900 text-base">{tool.name}</h3>
      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
        {tool.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {tool.available && (
        <div
          className={`mt-4 flex items-center gap-1 text-xs font-semibold ${styles.text} group-hover:gap-2 transition-all`}
        >
          Open tool
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  if (tool.available) {
    return <Link to={tool.path}>{content}</Link>;
  }

  return content;
};
