/**
 * Configuration for Tree of Links
 */

/**
 * Development flag to enable/disable mock implementations
 * When false, adapters will throw "Implement AppLauncher SDK" errors
 * When true, adapters will use local mock data for development
 *
 * Priority order:
 * 1. USE_MOCKS environment variable (if set to 'true' or 'false')
 * 2. NODE_ENV (development = true, anything else = false)
 * 3. Default to true for safety in development
 */
export const USE_MOCKS = process.env.USE_MOCKS !== 'false' && (process.env.USE_MOCKS === 'true' || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined);

/**
 * Check if mocks are enabled and throw error if not
 * Used by adapters to enforce SDK implementation
 */
export function requireAppLauncherSDK(): never {
  throw new Error('Implement AppLauncher SDK');
}
