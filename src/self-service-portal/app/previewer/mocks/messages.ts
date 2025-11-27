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

type Messages = Record<string, string>;

// Very small .properties parser – handles "key = value" / "key:value" / "key value"
// and ignores blank lines and comments starting with # or !.
function parseProperties(content: string): Messages {
    const result: Messages = {};

    const lines = content.split(/\r?\n/);
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#') || line.startsWith('!')) {
            continue;
        }

        // Find first occurrence of '=' or ':' or a whitespace separator
        let sepIndex = -1;
        let sepChar: string | null = null;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if ((ch === '=' || ch === ':' || ch === ' ') && line[i - 1] !== '\\') {
                sepIndex = i;
                sepChar = ch;
                break;
            }
        }

        let key: string;
        let value: string;

        if (sepIndex === -1) {
            key = line;
            value = '';
        } else {
            key = line.slice(0, sepIndex).trim();
            value = line.slice(sepIndex + 1).trim();
        }

        // Unescape escaped separators in key/value
        key = key.replace(/\\([=: ])/g, '$1');
        value = value.replace(/\\([=: ])/g, '$1');

        if (key) {
            result[key] = value;
        }
    }

    return result;
}

// Pick language from browser (or default to 'en')
function detectLanguage(): string {
    const lang = (navigator?.languages && navigator.languages.length)
        ? navigator.languages[0]
        : (navigator?.language ? navigator.language : 'en');

    return lang.toLowerCase().slice(0, 2);
}

// 1) Load all properties files for all languages
const allModules = import.meta.glob<string>(
    '../../../messages/*/apps/self-service-portal/*.properties',
    { query: '?raw', import: 'default', eager: true }
);

// 2) Build a map from language -> merged messages
const messagesByLang: Record<string, Messages> = {};

for (const filePath in allModules) {
    const fileContent = allModules[filePath];

    // filePath looks like:
    // ../../../messages/en/apps/self-service-portal/account.properties
    // Extract the language part between 'messages/' and '/apps'
    const match = filePath.match(/messages\/([^/]+)\/apps\/self-service-portal\//);
    const lang = match?.[1] ?? 'en';

    if (!messagesByLang[lang]) {
        messagesByLang[lang] = {};
    }

    const parsed = parseProperties(fileContent);
    Object.assign(messagesByLang[lang], parsed);
}

// 3) Choose the language at runtime
const currentLang = detectLanguage();

// fall back to 'en' if we don't have messages for this language
export const messages: Messages =
    messagesByLang[currentLang] ?? messagesByLang['en'] ?? {};