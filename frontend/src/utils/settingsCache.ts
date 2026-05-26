import axios from 'axios';
import { baseURL } from './index';

interface CachedSettings {
  data: any;
  timestamp: number;
}

let settingsCache: CachedSettings | null = null;
let pendingRequest: Promise<any> | null = null;
const CACHE_TTL = 60000; // 60 seconds

/**
 * Fetches game settings with a module-level cache to prevent
 * duplicate requests from multiple components (e.g., Game.tsx and Gamepage.tsx).
 * Uses request deduplication so concurrent calls share the same network request.
 */
export async function fetchCachedSettings(): Promise<any> {
  const now = Date.now();

  // Return cached data if still valid
  if (settingsCache && (now - settingsCache.timestamp) < CACHE_TTL) {
    return settingsCache.data;
  }

  // If a request is already in-flight, wait for it (request deduplication)
  if (pendingRequest) {
    return pendingRequest;
  }

  // Make the request and cache it
  pendingRequest = axios.get(`${baseURL}/settings`)
    .then(response => {
      const data = response.data.settings || response.data;
      settingsCache = { data, timestamp: Date.now() };
      pendingRequest = null;
      return data;
    })
    .catch(error => {
      pendingRequest = null;
      throw error;
    });

  return pendingRequest;
}

/**
 * Invalidate the settings cache (e.g., when settings are updated via socket).
 */
export function invalidateSettingsCache(): void {
  settingsCache = null;
}
