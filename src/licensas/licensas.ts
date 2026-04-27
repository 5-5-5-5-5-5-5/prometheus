// SPDX-License-Identifier: MIT

export type { DisclaimerAddResult, DisclaimerVerifyResult,PackageInfo, LicensasScanOptions as ScanOptions, ScanResult } from '@projeto-types/licensas';

// Re-export real implementations from sibling modules
export { addDisclaimer, verifyDisclaimer } from './disclaimer.js';
export { generateNotices } from './generate-notices.js';
export { scanCommand } from './scanner.js';