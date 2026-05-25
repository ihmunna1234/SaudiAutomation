import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UploadCard } from "../components/UploadCard";
import { ResultSection } from "../components/ResultSection";
import { InfoBox } from "../components/InfoBox";
import { AppShell } from "../components/AppShell";
import { BatchResponse, BatchItemResult, FileData, AppConfig } from "../types";
import { downloadIqamaExcel } from "../utils/exportExcel";
import { Settings2, X, XCircle, Sparkles, Cpu, Play } from "lucide-react";

export default function IqamaTool() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<BatchResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);

  const handleProcessBatch = async () => {
    const min = config?.minFiles ?? 1;
    const max = config?.maxFiles ?? 200;

    if (selectedFiles.length < min) {
      setErrorMsg(`Please upload at least ${min} Iqama image.`);
      return;
    }
    if (selectedFiles.length > max) {
      setErrorMsg(`Maximum ${max} Iqamas allowed.`);
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setProgress({ current: 0, total: selectedFiles.length });

    const results: BatchItemResult[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const f = selectedFiles[i];
        const slNo = i + 1;

        try {
          const res = await fetch("/api/extract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              file: f.base64,
              mimeType: f.mimeType,
              slNo,
            }),
          });

          const data = await res.json();
          if (!res.ok || data.status !== "success") {
            throw new Error(data.message || "Extraction failed");
          }

          results.push({
            slNo,
            fileName: f.fileName,
            status: "success",
            data: data.data,
          });
        } catch (e: any) {
          results.push({
            slNo,
            fileName: f.fileName,
            status: "error",
            message: e.message || "Extraction failed",
          });
        }

        setProgress({ current: i + 1, total: selectedFiles.length });
      }

      const batchResult: BatchResponse = {
        status: "success",
        results,
        totalProcessed: results.filter((r) => r.status === "success").length,
        totalFailed: results.filter((r) => r.status === "error").length,
      };

      setResult(batchResult);

      if (batchResult.totalProcessed && batchResult.totalProcessed > 0) {
        downloadIqamaExcel(results);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Batch processing failed.");
      setTimeout(() => setErrorMsg(null), 7000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setResult(null);
    setErrorMsg(null);
    setProgress({ current: 0, total: 0 });
  };

  const minFiles = config?.minFiles ?? 1;
  const maxFiles = config?.maxFiles ?? 200;
  const canProcess =
    selectedFiles.length >= minFiles &&
    selectedFiles.length <= maxFiles &&
    !isProcessing;

  return (
    <AppShell
      title="Iqama Scanner"
      subtitle="Bulk OCR · Excel export"
      headerRight={
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-indigo-100 shrink-0"
        >
          <Settings2 className="w-4 h-4" />
          <span className="hidden sm:inline">How it works</span>
        </button>
      }
    >
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-6"
          >
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <h3 className="font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Workflow
                </h3>
                <button
                  onClick={() => setShowExplanation(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                <li>Upload 1–200 Iqama images (JPG/PNG)</li>
                <li>AI extracts: SL NO, English name, Arabic name, Iqama No, BOD, Expire Date</li>
                <li>Download the results as an Excel file (.xlsx)</li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full">
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-effect rounded-3xl border border-slate-200 p-8 text-center space-y-5"
            >
              <div className="w-14 h-14 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Cpu className="w-7 h-7 animate-spin" />
              </div>
              <h3 className="font-bold text-slate-900">Extracting Iqama data</h3>
              <p className="text-xs text-slate-500">
                Processing {progress.current} of {progress.total} Iqama
                {progress.total !== 1 ? "s" : ""}…
              </p>
              <div className="w-full max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                  style={{
                    width: progress.total
                      ? `${Math.min(100, (progress.current / progress.total) * 100)}%`
                      : "30%",
                  }}
                />
              </div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ResultSection result={result} onReset={handleReset} />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Iqama Bulk Upload
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                  Upload {minFiles}–{maxFiles} Iqamas. Extract data and download as Excel.
                </p>
              </div>

              <UploadCard
                files={selectedFiles}
                onFilesChange={setSelectedFiles}
                maxFiles={maxFiles}
              />

              <button
                onClick={handleProcessBatch}
                disabled={!canProcess}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
              >
                <Play className="w-5 h-5" />
                Extract & Download Excel
                {selectedFiles.length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                    {selectedFiles.length}
                  </span>
                )}
              </button>

              {selectedFiles.length > 0 && selectedFiles.length < minFiles && (
                <p className="text-center text-xs text-amber-600">
                  Add at least {minFiles} file to continue
                </p>
              )}

              <InfoBox />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md"
            >
              <div className="bg-rose-950 text-rose-200 px-4 py-3 rounded-2xl shadow-xl flex gap-3 border border-rose-500/20">
                <XCircle className="w-5 h-5 shrink-0" />
                <div className="flex-1 text-xs">
                  <span className="font-bold text-white block">Error</span>
                  {errorMsg}
                </div>
                <button onClick={() => setErrorMsg(null)} className="text-rose-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
