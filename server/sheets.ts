import { google } from "googleapis";
import type { IqamaRow } from "./ocr";

const HEADERS = [
  "SL NO",
  "Name (English)",
  "Name (Arabic)",
  "Iqama No",
  "BOD",
  "Expire Date",
];

export function getSheetId(): string | null {
  const url = process.env.GOOGLE_SHEET_URL || "";
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  return process.env.GOOGLE_SHEET_ID || null;
}

export function getSheetUrl(): string | null {
  const url = process.env.GOOGLE_SHEET_URL?.trim();
  if (url) return url;
  const id = getSheetId();
  return id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : null;
}

function getServiceAccountCredentials() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    return JSON.parse(json);
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (email && privateKey) {
    return {
      client_email: email,
      private_key: privateKey,
    };
  }

  return null;
}

export function isSheetsConfigured(): boolean {
  return Boolean(getSheetId() && getServiceAccountCredentials());
}

async function getSheetsClient() {
  const credentials = getServiceAccountCredentials();
  if (!credentials) {
    throw new Error(
      "Google Sheets not configured. Set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in .env"
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function getTabName(): string {
  return process.env.GOOGLE_SHEET_TAB_NAME?.trim() || "Sheet1";
}

export async function getNextSlNo(): Promise<number> {
  if (!isSheetsConfigured()) return 1;

  const sheets = await getSheetsClient();
  const spreadsheetId = getSheetId()!;
  const tab = getTabName();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!A:A`,
  });

  const rows = res.data.values || [];
  if (rows.length <= 1) return 1;

  let maxSl = 0;
  for (let i = 1; i < rows.length; i++) {
    const val = parseInt(String(rows[i][0]), 10);
    if (!isNaN(val) && val > maxSl) maxSl = val;
  }
  return maxSl + 1;
}

async function ensureHeaders() {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSheetId()!;
  const tab = getTabName();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!A1:F1`,
  });

  const firstRow = res.data.values?.[0];
  if (firstRow && firstRow.length >= 6) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${tab}!A1:F1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADERS] },
  });
}

function rowToValues(row: IqamaRow): string[] {
  return [
    String(row.slNo),
    row.nameEnglish,
    row.nameArabic,
    row.iqamaNo,
    row.bod,
    row.expireDate,
  ];
}

export async function appendRows(rows: IqamaRow[]): Promise<void> {
  if (rows.length === 0) return;

  const sheets = await getSheetsClient();
  const spreadsheetId = getSheetId()!;
  const tab = getTabName();

  await ensureHeaders();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A:F`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: rows.map(rowToValues),
    },
  });
}
