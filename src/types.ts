/** @deprecated Used only by IqamaMockCard — prefer IqamaRow */
export interface IqamaData {
  iqamaNumber: string;
  nameEnglish: string;
  nameArabic: string;
  nationality?: string;
  dateOfBirthGregorian: string;
  expiryDateGregorian: string;
  occupation?: string;
  sponsorName?: string;
}

export interface IqamaRow {
  slNo: number;
  nameEnglish: string;
  nameArabic: string;
  iqamaNo: string;
  bod: string;
  expireDate: string;
}

export interface FileData {
  base64: string;
  mimeType: string;
  fileName: string;
  fileSize: number;
}

export interface BatchItemResult {
  slNo: number;
  fileName: string;
  status: "success" | "error";
  data?: IqamaRow;
  message?: string;
}

export interface BatchResponse {
  status: "success" | "error";
  message?: string;
  results?: BatchItemResult[];
  savedToSheet?: boolean;
  sheetUrl?: string | null;
  totalProcessed?: number;
  totalFailed?: number;
}

export interface AppConfig {
  minFiles: number;
  maxFiles: number;
}
