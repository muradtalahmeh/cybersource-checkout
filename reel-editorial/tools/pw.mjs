// Resolve Playwright from the project or from the global npm root (no install step).
import { createRequire } from 'module';
import { execSync } from 'child_process';
import path from 'path';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch {
  pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
}
export const chromium = pw.chromium;
