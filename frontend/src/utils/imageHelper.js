// src/utils/imageHelper.js
export const getImageUrl = (filename) => {
  if (!filename) return "";

  // already a data URI?
  if (filename.startsWith("data:image")) return filename;

  // full-URL?
  if (/^https?:\/\//.test(filename)) return filename;

  // remove any leading slash
  let clean = filename.startsWith("/") ? filename.slice(1) : filename;

  // if it already contains “uploads/”, strip it
  if (clean.startsWith("uploads/")) {
    clean = clean.slice("uploads/".length);
  }

  // now build the final URL
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  return `${base}/uploads/${encodeURIComponent(clean)}`;
};
