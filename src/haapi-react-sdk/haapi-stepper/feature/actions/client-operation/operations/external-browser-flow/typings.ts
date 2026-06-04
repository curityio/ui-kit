export enum EXTERNAL_BROWSER_FLOW_ERROR_TYPE {
  /** Launch failed (popup blocked, browser policy, etc.). */
  LAUNCH = 'launch',
  /** Resume failed — postMessage couldn't be consumed (unexpected origin/type) or operation aborted. */
  RESUME = 'resume',
}
