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
import https from 'node:https';
import crypto from 'node:crypto';

async function main() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const checksums = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'previewer-checksums.json'), 'utf-8'));
    const version = checksums.version;
    const expectedSha256BySuffix = checksums.sha256;

    if (!version || typeof expectedSha256BySuffix !== 'object') {
        throw new Error('previewer-checksums.json must contain "version" and "sha256" properties');
    }

    const assetSuffix = resolveAssetSuffix(Object.keys(expectedSha256BySuffix));
    const expectedSha256 = expectedSha256BySuffix[assetSuffix];
    const assetName = `curity-ui-kit-previewer-${version}-${assetSuffix}.zip`;

    const libFolder = '../../lib/';
    const zipFile = assetName;
    const source = path.resolve(__dirname, libFolder + zipFile);
    const target = path.resolve(__dirname, libFolder);
    const versionMarker = path.join(target, '.previewer-version');

    if (fs.existsSync(versionMarker) && fs.readFileSync(versionMarker, 'utf-8').trim() === version) {
        console.log('UI Kit runtime already unzipped. Skipping...');
        return;
    }

    if (!fs.existsSync(source)) {
        await downloadPreviewerZip(version, assetSuffix, assetName, source);
    }

    if (!fs.existsSync(source)) {
        console.error(`Previewer zip does not exist: ${source}`);
        process.exit(1);
    }

    if (!expectedSha256) {
        throw new Error(`No checksum found for platform suffix '${assetSuffix}' in previewer-checksums.json`);
    }
    await verifySha256(source, expectedSha256);

    await extract(source, { dir: target });
    console.log(`Unzipped ${source} to ${target}`);

    await extractNestedZip(target, `ui-kit-runtime-${version}.zip`);

    fs.writeFileSync(versionMarker, version + '\n');
}

function resolveAssetSuffix(supportedSuffixes) {
    const platformMap = {
        linux: 'linux',
        darwin: 'macos',
        win32: 'windows',
    };
    const archMap = {
        x64: 'x64',
        arm64: 'arm64',
    };

    const platform = platformMap[process.platform];
    const arch = archMap[process.arch];
    const suffix = `${platform}-${arch}`;

    if (!platform || !arch || !supportedSuffixes.includes(suffix)) {
        throw new Error(`Unsupported platform/arch: ${process.platform}/${process.arch}`);
    }

    return suffix;
}

function downloadPreviewerZip(version, assetSuffix, assetName, destinationPath) {
    const url = `https://github.com/curityio/ui-kit/releases/download/${version}/${assetName}`;
    const destinationDir = path.dirname(destinationPath);

    fs.mkdirSync(destinationDir, { recursive: true });

    console.log(`Downloading ${url}`);

    return downloadWithRedirects(url, destinationPath, 5);
}

function downloadWithRedirects(url, destinationPath, remainingRedirects) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(destinationPath);
        const request = https.get(url, response => {
            const { statusCode } = response;
            const location = response.headers.location;

            if (statusCode && statusCode >= 300 && statusCode < 400 && location) {
                if (remainingRedirects === 0) {
                    fileStream.close();
                    fs.unlink(destinationPath, () => {
                        reject(new Error(`Too many redirects while downloading ${url}`));
                    });
                    return;
                }

                const nextUrl = new URL(location, url).toString();
                fileStream.close();
                fs.unlink(destinationPath, () => {
                    resolve(downloadWithRedirects(nextUrl, destinationPath, remainingRedirects - 1));
                });
                return;
            }

            if (statusCode !== 200) {
                fileStream.close();
                fs.unlink(destinationPath, () => {
                    reject(new Error(`Download failed: ${statusCode} ${response.statusMessage}`));
                });
                return;
            }

            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close(resolve);
            });
        });

        request.on('error', err => {
            fileStream.close();
            fs.unlink(destinationPath, () => reject(err));
        });
    });
}

function verifySha256(filePath, expectedSha256) {
    const normalizedExpected = expectedSha256.trim().toLowerCase();

    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);

        stream.on('error', reject);
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => {
            const digest = hash.digest('hex');
            if (digest !== normalizedExpected) {
                reject(new Error(`SHA256 mismatch for ${filePath}: expected ${normalizedExpected}, got ${digest}`));
                return;
            }
            resolve();
        });
    });
}

async function extractNestedZip(targetDir, nestedZipFileName) {
    const nestedZipPath = path.join(targetDir, nestedZipFileName);

    if (!fs.existsSync(nestedZipPath)) {
        console.log(`Nested zip not found: ${nestedZipPath}`);
        return;
    }

    await extract(nestedZipPath, { dir: targetDir });
    console.log(`Unzipped nested archive ${nestedZipPath} to ${targetDir}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
