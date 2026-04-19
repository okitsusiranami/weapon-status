import { loadSettings } from "./config.js";
import { createLogger } from "./logger.js";
import { fetchWeapons } from "./fortniteClient.js";
import { SHEET_COLUMNS, transformWeapons } from "./transform.js";
import { writeRows } from "./sheetsClient.js";

async function main(): Promise<number> {
  const settings = loadSettings();
  const logger = createLogger(settings.logLevel);

  try {
    const startedAt = performance.now();
    logger.info("Starting weapon status sync");

    const weapons = await fetchWeapons(settings, logger);
    const rows = transformWeapons(weapons as Parameters<typeof transformWeapons>[0]);

    if (rows.length === 0) {
      throw new Error("API returned zero records after transformation.");
    }

    await writeRows(settings, logger, SHEET_COLUMNS, rows);

    const elapsed = ((performance.now() - startedAt) / 1000).toFixed(2);
    logger.info(`Sync completed. records=${rows.length} elapsed_sec=${elapsed}`);
    return 0;
  } catch (err) {
    logger.error(`Sync failed: ${err}`);
    return 1;
  }
}

main().then((code) => process.exit(code));
