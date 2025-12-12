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
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function main() {
    const libFolder = '../../lib/';
    const zipFile = 'ui-kit-runtime.zip';
    const presenceFile = 'run-ui-kit-server.sh';
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const source = path.resolve(__dirname, libFolder + zipFile);
    const target = path.resolve(__dirname, libFolder);
    const presence = path.join(target, presenceFile);

    if (fs.existsSync(presence)) {
        console.log('UI Kit runtime already unzipped. Skipping...');
        return;
    }
    if (!fs.existsSync(source)) {
        console.error('ui-kit-runtime.zip file does not exist:', source);
        process.exit(1);
    }

    await extract(source, { dir: target });
    console.log(`Unzipped ${source} to ${target}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
