/** Max photos per case to avoid memory/localStorage crashes (e.g. 45+ full base64 in state). */
export const MAX_PHOTOS_PER_CASE = 25;

/** Max thumbnail <img> elements to render in preview grids to avoid DOM/memory pressure. */
export const MAX_PHOTOS_PREVIEW = 12;

/**
 * Storage uses IndexedDB; capacity is browser quota (typically hundreds of MB+).
 * Target: 50–100+ cases with up to 25 photos each.
 */
export const STORAGE_LIMIT_MB = 400;
