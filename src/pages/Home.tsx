import React from "react";
import { motion } from "motion/react";
import { Sparkles, Wrench } from "lucide-react";
import { ToolCard } from "../components/ToolCard";
import { tools } from "../config/tools";

export default function Home() {
  const availableCount = tools.filter((t) => t.available).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Automation Toolkit
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Injamul's Automation
          </h1>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            One home for document tools — Iqama OCR, Excel export, and more coming soon.
          </p>

        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
            All tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[11px] text-slate-400 mt-12"
        >
          To add a new tool, edit{" "}
          <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
            src/config/tools.ts
          </code>{" "}
          and create a page under{" "}
          <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
            src/pages/
          </code>
        </motion.p>
      </div>
    </div>
  );
}
