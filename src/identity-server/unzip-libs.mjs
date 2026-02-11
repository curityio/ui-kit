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
    const version = '1.0.0';
    const expectedSha256BySuffix = {
        "linux-arm64": '69be61326f5d305ed5b0d27659bb5a6ecf2fc9fc517a1f7a1ed4a560011591dd',
        "linux-x64": '6050d404473c3fbba707513d8f99d3f10fc953e6fe6cc8a118b2a22c99ea1729',
        "macos-arm64": 'b9c227f429adbb7089b6b88ad1676e546bb57faf5c9abe5f22cdbafe90c61e1e',
        "windows-x64": 'e572cc627d7aee9fd7f3928ba9bd9004da367ce83cb58e54616d2a17872b2c5e',
    };
    const assetSuffix = resolveAssetSuffix();
    const expectedSha256 = expectedSha256BySuffix[assetSuffix];
    const assetName = `curity-ui-kit-previewer-${version}-${assetSuffix}.zip`;

    const libFolder = '../../lib/';
    const zipFile = assetName;
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
        await downloadPreviewerZip(version, assetSuffix, assetName, source);
    }

    if (!fs.existsSync(source)) {
        console.error('ui-kit-runtime.zip file does not exist:', source);
        process.exit(1);
    }

    if (expectedSha256) {
        await verifySha256(source, expectedSha256);
    }

    await extract(source, { dir: target });
    console.log(`Unzipped ${source} to ${target}`);

    await extractNestedZip(target, `ui-kit-runtime-${version}.zip`);
}

function resolveAssetSuffix() {
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

    if (!platform || !arch) {
        throw new Error(`Unsupported platform/arch: ${process.platform}/${process.arch}`);
    }

    return `${platform}-${arch}`;
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
