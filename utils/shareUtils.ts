import { TalentReport } from '../types';

/**
 * Encodes the talent report into a Base64 string safe for URL hash.
 * Uses standard btoa with unicode support.
 */
export const encodeReport = (data: TalentReport): string => {
  try {
    const json = JSON.stringify(data);
    // transform to ensure unicode characters are handled correctly by btoa
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    console.error("Failed to encode report", e);
    return "";
  }
};

/**
 * Decodes a Base64 string from URL hash back into a TalentReport object.
 */
export const decodeReport = (encoded: string): TalentReport | null => {
  try {
    // decode back from base64
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode report", e);
    return null;
  }
};