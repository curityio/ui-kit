/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

/*
 * Fails the build when a stylesheet in the webroot references an asset with a root-absolute
 * URL. Those URLs ignore `static-resource-root-path`, so every font and image behind them
 * 404s on a deployment that sets one (IS-11847). Write them relative to the stylesheet
 * instead - `url("../fonts/…")`, `url("../images/…")`.
 */

import fs from "fs";
import path from "path";

const CSS_DIR = path.resolve(import.meta.dirname, "build/webroot/assets/css");

// url(/…) in any of its quoting styles. Protocol-relative URLs (//host/…) and data: URIs
// are left alone - neither depends on the root path.
const ABSOLUTE_URL = /url\(\s*(['"]?)\/(?!\/)/;

const offences = [];

const cssFiles = fs.existsSync(CSS_DIR)
  ? fs.readdirSync(CSS_DIR).filter((name) => name.endsWith(".css"))
  : [];

for (const name of cssFiles) {
  const file = path.join(CSS_DIR, name);
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      if (ABSOLUTE_URL.test(line)) {
        offences.push({ file: name, line: index + 1, text: line.trim() });
      }
    });
}

if (cssFiles.length === 0) {
  console.warn("\x1b[33m%s\x1b[0m", `! No stylesheets found in ${CSS_DIR} - nothing checked`);
}

if (offences.length > 0) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    `✘ ${offences.length} root-absolute asset URL(s) in the built CSS:`
  );
  for (const { file, line, text } of offences) {
    // Truncate: minified CSS puts a whole stylesheet on one line.
    console.error(`  ${file}:${line}  ${text.slice(0, 160)}`);
  }
  console.error(
    "\x1b[31m%s\x1b[0m",
    'These ignore static-resource-root-path. Use url("../fonts/…") / url("../images/…").'
  );
  process.exit(1);
}

console.log("\x1b[32m%s\x1b[0m", "✔︎ No root-absolute asset URLs in the built CSS");
