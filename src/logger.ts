export function createLogger(level: string) {
  const levels = ["DEBUG", "INFO", "WARN", "ERROR"];
  const minLevel = levels.indexOf(level.toUpperCase());

  function log(lvl: string, message: string, ...args: unknown[]) {
    if (levels.indexOf(lvl) >= minLevel) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${lvl}: ${message}`, ...args);
    }
  }

  return {
    debug: (msg: string, ...args: unknown[]) => log("DEBUG", msg, ...args),
    info: (msg: string, ...args: unknown[]) => log("INFO", msg, ...args),
    warn: (msg: string, ...args: unknown[]) => log("WARN", msg, ...args),
    error: (msg: string, ...args: unknown[]) => log("ERROR", msg, ...args),
  };
}

export type Logger = ReturnType<typeof createLogger>;
