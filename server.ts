import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { extractIqamaData } from "./server/ocr";
import {
  appendRows,
  getNextSlNo,
  getSheetUrl,
  isSheetsConfigured,
} from "./server/sheets";

dotenv.config();

const MIN_FILES = 1;
const MAX_FILES = 200;
const CONCURRENCY = 3;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  app.get("/api/config", (_req, res) => {
    res.json({
      minFiles: MIN_FILES,
      maxFiles: MAX_FILES,
    });
  });

  app.post("/api/extract", async (req, res) => {
    try {
      const { file, mimeType, slNo } = req.body;
      if (!file) {
        return res
          .status(400)
          .json({ status: "error", message: "No image provided" });
      }
      if (!slNo || slNo < 1) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid SL NO" });
      }

      const row = await extractIqamaData(file, mimeType || "image/jpeg", slNo);
      return res.json({ status: "success", data: row });
    } catch (e: any) {
      console.error("Extract failed:", e);
      return res.status(500).json({
        status: "error",
        message: e.message || "Failed to extract Iqama data",
      });
    }
  });

  app.post("/api/sheets/append", async (req, res) => {
    try {
      const { rows } = req.body;
      if (!Array.isArray(rows) || rows.length === 0) {
        return res
          .status(400)
          .json({ status: "error", message: "No rows to save" });
      }

      if (!isSheetsConfigured()) {
        return res.status(400).json({
          status: "error",
          message:
            "Google Sheet is not configured. Add GOOGLE_SHEET_URL and service account credentials to .env",
        });
      }

      await appendRows(rows);
      return res.json({
        status: "success",
        message: `${rows.length} row(s) saved to Google Sheet`,
        sheetUrl: getSheetUrl(),
      });
    } catch (e: any) {
      console.error("Sheets append failed:", e);
      return res.status(500).json({
        status: "error",
        message: e.message || "Failed to save to Google Sheet",
      });
    }
  });

  app.post("/api/process-batch", async (req, res) => {
    try {
      const { files } = req.body;
      if (!Array.isArray(files) || files.length < MIN_FILES) {
        return res.status(400).json({
          status: "error",
          message: `Upload at least ${MIN_FILES} Iqama image`,
        });
      }
      if (files.length > MAX_FILES) {
        return res.status(400).json({
          status: "error",
          message: `Maximum ${MAX_FILES} Iqamas allowed per batch`,
        });
      }

      let startSlNo = 1;
      if (isSheetsConfigured()) {
        startSlNo = await getNextSlNo();
      }

      const results: Array<{
        slNo: number;
        fileName: string;
        status: "success" | "error";
        data?: ReturnType<typeof extractIqamaData> extends Promise<infer T>
          ? T
          : never;
        message?: string;
      }> = [];

      const successfulRows: Awaited<ReturnType<typeof extractIqamaData>>[] = [];

      for (let i = 0; i < files.length; i += CONCURRENCY) {
        const chunk = files.slice(i, i + CONCURRENCY);
        const chunkResults = await Promise.all(
          chunk.map(async (item: { file: string; mimeType: string; fileName: string }, idx: number) => {
            const slNo = startSlNo + i + idx;
            try {
              const row = await extractIqamaData(
                item.file,
                item.mimeType || "image/jpeg",
                slNo
              );
              successfulRows.push(row);
              return {
                slNo,
                fileName: item.fileName || `iqama-${slNo}.jpg`,
                status: "success" as const,
                data: row,
              };
            } catch (e: any) {
              return {
                slNo,
                fileName: item.fileName || `iqama-${slNo}.jpg`,
                status: "error" as const,
                message: e.message || "Extraction failed",
              };
            }
          })
        );
        results.push(...chunkResults);
      }

      let savedToSheet = false;
      let sheetUrl = getSheetUrl();

      if (successfulRows.length > 0 && isSheetsConfigured()) {
        await appendRows(successfulRows);
        savedToSheet = true;
      }

      return res.json({
        status: "success",
        results,
        savedToSheet,
        sheetUrl,
        totalProcessed: results.filter((r) => r.status === "success").length,
        totalFailed: results.filter((r) => r.status === "error").length,
      });
    } catch (e: any) {
      console.error("Batch processing failed:", e);
      return res.status(500).json({
        status: "error",
        message: e.message || "Batch processing failed",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
