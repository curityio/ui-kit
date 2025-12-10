/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import extract from 'extract-zip';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function main() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const source = path.resolve(__dirname, '../../lib/ui-kit-runtime-darwin-arm64-1.0.0.zip');
    const target = path.resolve(__dirname, '../../lib/');

    if (!source) {
        console.error('Usage: node scripts/unzip.js <archive.zip> [dest]');
        process.exit(1);
    }

    await extract(source, { dir: target });
    console.log(`Unzipped ${source} to ${target}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
