import { FortniteAPI } from "@yaelouuu/fortnite-api";
import type { Settings } from "./config.js";
import type { Logger } from "./logger.js";

export async function fetchWeapons(settings: Settings, logger: Logger) {
  const client = new FortniteAPI({ apiKey: settings.fortniteApiKey });

  logger.info("Fetching BR weapons from Fortnite API...");

  const response = await client.weapons.getWeapons({
    version: "current",
    gamemode: "br",
    
  });

  const weaponMap = response.data;
  const weapons = Object.values(weaponMap);

  logger.info(`Fetched ${weapons.length} BR weapons (version: ${response.version})`);
  return weapons;
}
