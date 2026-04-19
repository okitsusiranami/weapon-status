import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Settings } from "./config.js";
import type { Logger } from "./logger.js";

function loadCredentials(raw: string): Record<string, string> {
  try {
    const path = resolve(raw);
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return JSON.parse(raw);
  }
}

export async function writeRows(
  settings: Settings,
  logger: Logger,
  headers: readonly string[],
  rows: (string | number)[][],
) {
  const creds = loadCredentials(settings.googleServiceAccountJson);

  const auth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(settings.googleSheetId, auth);
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[settings.googleSheetName];
  if (!sheet) {
    throw new Error(`Sheet "${settings.googleSheetName}" not found.`);
  }

  await sheet.clear();
  await sheet.setHeaderRow([...headers]);

  const objectRows = rows.map((row) => {
    const obj: Record<string, string | number> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? "";
    });
    return obj;
  });

  await sheet.addRows(objectRows);

  logger.info(`Wrote ${rows.length} rows to sheet "${settings.googleSheetName}"`);
}
