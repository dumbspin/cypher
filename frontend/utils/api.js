/**
 * API utility — wraps the backend REST API calls for the frontend.
 *
 * All functions use the NEXT_PUBLIC_API_URL environment variable as
 * the base URL so deployments only need to update a single env var.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Analyse a single URL by calling POST /analyze.
 *
 * @param {string} url - The URL to analyse.
 * @returns {Promise<object>} The AnalyzeResponse from the backend.
 * @throws {Error} On network failure or non-200 HTTP status.
 */
export async function analyzeUrl(url) {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(
      errData.detail || `Server returned ${response.status}`
    );
  }

  return response.json();
}

/**
 * Upload a CSV file for bulk URL scanning via POST /bulk.
 *
 * @param {File} file - A File object from an <input type="file"> or dropzone.
 * @param {function} onProgress - Optional progress callback (not used with fetch).
 * @returns {Promise<object>} The BulkAnalyzeResponse from the backend.
 * @throws {Error} On network failure or non-200 HTTP status.
 */
export async function bulkAnalyzeUrls(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/bulk`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(
      errData.detail || `Server returned ${response.status}`
    );
  }

  return response.json();
}

/**
 * Helper to determine the colour class for a given risk score.
 *
 * @param {number} score - Risk score 0–100.
 * @returns {string} Tailwind colour token name ('success' | 'warning' | 'danger').
 */
export function scoreToColour(score) {
  if (score < 30) return "success";
  if (score < 60) return "warning";
  return "danger";
}

/**
 * Helper to determine hex colour for Chart.js from risk score.
 *
 * @param {number} score - Risk score 0–100.
 * @returns {string} Hex colour string.
 */
export function scoreToHex(score) {
  if (score < 30) return "#00C853";
  if (score < 60) return "#FF9100";
  return "#FF4C4C";
}
