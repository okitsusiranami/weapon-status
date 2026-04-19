import "dotenv/config";

export interface Settings {
  fortniteApiKey: string;
  googleServiceAccountJson: string;
  googleSheetId: string;
  googleSheetName: string;
  logLevel: string;
}

const REQUIRED_KEYS = [
  "FORTNITE_API_KEY",
  "GOOGLE_SERVICE_ACCOUNT_JSON",
  "GOOGLE_SHEET_ID",
] as const;

export function loadSettings(): Settings {
  const missing = REQUIRED_KEYS.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    fortniteApiKey: process.env.FORTNITE_API_KEY!,
    googleServiceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON!,
    googleSheetId: process.env.GOOGLE_SHEET_ID!,
    googleSheetName: process.env.GOOGLE_SHEET_NAME ?? "weapon_status",
    logLevel: process.env.LOG_LEVEL ?? "INFO",
  };
}
