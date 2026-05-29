/**
 * Tiny prefixed logger, mirroring the ANB convention.
 * `log`/`warn` are silenced in production unless TESTING_MODE is set; errors
 * always surface.
 */
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const TESTING_MODE = process.env.TESTING_MODE === 'true';

export function createLogger(prefix: string) {
  return {
    log: (...args: unknown[]) => {
      if (IS_DEVELOPMENT || TESTING_MODE) console.log(`[${prefix}]`, ...args);
    },
    error: (...args: unknown[]) => {
      console.error(`[${prefix}]`, ...args);
    },
    warn: (...args: unknown[]) => {
      if (IS_DEVELOPMENT || TESTING_MODE) console.warn(`[${prefix}]`, ...args);
    },
  };
}
