export const SHEET_COLUMNS = [
  "weapon_id",
  "name",
  "rarity",
  "type",
  "damage",
  "headshot_damage",
  "fire_rate",
  "magazine_size",
  "reload_time",
  "critical_damage_multiplier",
  "environment_damage_per_bullet",
  "ammo_cost_per_fire",
  "bullets_per_cartridge",
  "max_damage_per_cartridge",
  "patch",
  "ammo_type",
  "item_type",
  "gamemode",
  "image_icon_url",
  "updated_at_utc",
] as const;

interface WeaponRecord {
  id?: string;
  displayName?: string;
  rarity?: string;
  type?: string;
  category?: string | null;
  gamemode?: string;
  ammoType?: string | null;
  tags?: string[];
  stats?: {
    damagePerBullet?: number;
    firingRate?: number;
    clipSize?: number;
    reloadTime?: number;
    criticalDamageMultiplier?: number;
    environmentDamagePerBullet?: number;
    ammoCostPerFire?: number;
    bulletsPerCartridge?: number;
    maxDamagePerCartridge?: number;
  };
  patch?: string | null;
  images?: {
    icon?: string | null;
    largeIcon?: string | null;
  };
  season?: { chapter: number; season: number } | null;
}

export function transformWeapons(weapons: WeaponRecord[]): (string | number)[][] {
  const updatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  return weapons.map((w) => {
    const stats = w.stats ?? {};
    const images = w.images ?? {};
    const damage = stats.damagePerBullet ?? "";
    const critMult = stats.criticalDamageMultiplier ?? "";

    let headshotDamage: number | string = "";
    if (typeof damage === "number" && typeof critMult === "number") {
      headshotDamage = Math.round(damage * critMult * 100) / 100;
    }

    const season = w.season
      ? `CH${w.season.chapter}S${w.season.season}`
      : "";

    return [
      w.id ?? "",
      w.displayName ?? "",
      w.rarity ?? "",
      w.type ?? "",
      damage,
      headshotDamage,
      stats.firingRate ?? "",
      stats.clipSize ?? "",
      stats.reloadTime ?? "",
      critMult,
      stats.environmentDamagePerBullet ?? "",
      stats.ammoCostPerFire ?? "",
      stats.bulletsPerCartridge ?? "",
      stats.maxDamagePerCartridge ?? "",
      w.patch ?? "",
      w.ammoType ?? "",
      w.category ?? "",
      w.gamemode ?? "",
      images.icon ?? images.largeIcon ?? "",
      updatedAt,
    ];
  });
}
