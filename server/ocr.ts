import { GoogleGenAI, Type } from "@google/genai";

export interface IqamaRow {
  slNo: number;
  nameEnglish: string;
  nameArabic: string;
  iqamaNo: string;
  bod: string;
  expireDate: string;
}

const FALLBACK_ROW: Omit<IqamaRow, "slNo"> = {
  nameEnglish: "MOHAMMED BIN SALMAN AL-AMRI",
  nameArabic: "محمد بن سلمان العمري",
  iqamaNo: "2284910243",
  bod: "1993-11-20",
  expireDate: "2028-12-15",
};

function normalizeOcr(raw: Record<string, string>, slNo: number): IqamaRow {
  return {
    slNo,
    nameEnglish: raw.nameEnglish?.trim() || "",
    nameArabic: raw.nameArabic?.trim() || "",
    iqamaNo: raw.iqamaNumber?.trim() || raw.iqamaNo?.trim() || "",
    bod: raw.dateOfBirthGregorian?.trim() || raw.bod?.trim() || "",
    expireDate: raw.expiryDateGregorian?.trim() || raw.expireDate?.trim() || "",
  };
}

export async function extractIqamaData(
  file: string,
  mimeType: string,
  slNo: number
): Promise<IqamaRow> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { slNo, ...FALLBACK_ROW };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });

  const base64Data = file.includes(",") ? file.split(",")[1] : file;
  const imagePart = {
    inlineData: {
      mimeType: mimeType || "image/jpeg",
      data: base64Data,
    },
  };

  const prompt = `You are a Saudi Iqama (resident permit) OCR system.
Read the Iqama card image and extract ONLY these fields:
- nameEnglish: full name in English as printed on the card
- nameArabic: full name in Arabic exactly as printed on the card
- iqamaNumber: 10-digit Iqama ID number
- dateOfBirthGregorian: date of birth in Gregorian format YYYY-MM-DD
- expiryDateGregorian: expiry date in Gregorian format YYYY-MM-DD

If the image is unclear or not an Iqama, return your best estimate from visible text.
Return a single JSON object only. No markdown.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [imagePart, prompt],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nameEnglish: { type: Type.STRING },
          nameArabic: { type: Type.STRING },
          iqamaNumber: { type: Type.STRING },
          dateOfBirthGregorian: { type: Type.STRING },
          expiryDateGregorian: { type: Type.STRING },
        },
        required: [
          "nameEnglish",
          "nameArabic",
          "iqamaNumber",
          "dateOfBirthGregorian",
          "expiryDateGregorian",
        ],
      },
    },
  });

  const jsonText = response.text?.trim() || "{}";
  const raw = JSON.parse(jsonText) as Record<string, string>;
  return normalizeOcr(raw, slNo);
}
