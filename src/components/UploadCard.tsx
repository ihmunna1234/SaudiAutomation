import React, { useRef, useState } from "react";
import { Upload, FileWarning, X, Files } from "lucide-react";
import { FileData } from "../types";

const MIN_FILES = 1;
const MAX_FILES = 200;
const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg"];

interface UploadCardProps {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
  maxFiles?: number;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  files,
  onFilesChange,
  maxFiles = MAX_FILES,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File): Promise<FileData> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          base64: reader.result as string,
          mimeType: file.type,
          fileName: file.name,
          fileSize: file.size,
        });
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const validateFile = (file: File): string | null => {
    if (!VALID_TYPES.includes(file.type)) {
      return `${file.name}: only JPG, JPEG, PNG allowed`;
    }
    if (file.size > MAX_SIZE) {
      return `${file.name}: exceeds 5MB limit`;
    }
    return null;
  };

  const addFiles = async (incoming: FileList | File[]) => {
    setErrorMsg(null);
    const list = Array.from(incoming);

    if (files.length + list.length > maxFiles) {
      setErrorMsg(`Maximum ${maxFiles} Iqamas allowed. You have ${files.length} selected.`);
      return;
    }

    const errors: string[] = [];
    const valid: File[] = [];
    for (const file of list) {
      const err = validateFile(file);
      if (err) errors.push(err);
      else valid.push(file);
    }

    if (errors.length > 0) {
      setErrorMsg(errors.slice(0, 3).join(" · ") + (errors.length > 3 ? " …" : ""));
    }

    if (valid.length === 0) return;

    try {
      const newData = await Promise.all(valid.map(readFile));
      onFilesChange([...files, ...newData]);
    } catch {
      setErrorMsg("Failed to read one or more files.");
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragActive(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 transition-all duration-300 ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50/50"
            : "border-slate-300 hover:border-indigo-400 bg-white/50"
        } glass-effect`}
      >
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-3 shadow-sm border border-indigo-100">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-slate-800 font-semibold text-sm">
            Upload Iqama images (bulk)
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Drag & drop or <span className="text-indigo-600 font-semibold">browse</span> —{" "}
            {MIN_FILES} to {maxFiles} files
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 text-[10px] text-slate-400 font-mono">
            <span>JPG, PNG</span>
            <span>•</span>
            <span>Max 5MB each</span>
            <span>•</span>
            <span>{MIN_FILES}–{maxFiles} Iqamas</span>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold flex items-center gap-1.5">
              <Files className="w-3.5 h-3.5" />
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </span>
            <button
              type="button"
              onClick={() => onFilesChange([])}
              className="text-rose-600 hover:text-rose-700 font-medium"
            >
              Clear all
            </button>
          </div>
          <ul className="max-h-36 overflow-y-auto space-y-1">
            {files.map((f, i) => (
              <li
                key={`${f.fileName}-${i}`}
                className="flex items-center justify-between gap-2 text-[11px] text-slate-600 bg-slate-50 px-2 py-1.5 rounded-lg"
              >
                <span className="truncate">{f.fileName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="text-slate-400 hover:text-rose-500 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-3 rounded-xl text-rose-600 text-xs">
          <FileWarning className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
