/**
 * singleton JS Helper file provides reusable code
 */
/**
 * return the integer progress in [0-100]. clipping abnormal inputs
 * @param {*} progress input, NaN will be set to 0
 * @returns normalized progress percentage
 */
function normalizeProgress(progress) {
  if (isNaN(progress)) return 0;
  progress = Math.round(progress);
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;
  return progress;
}
module.exports = normalizeProgress;
