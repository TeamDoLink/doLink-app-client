#!/usr/bin/env node
/**
 * android/gradle.properties를 덮어쓰지 않고,
 * ci/gradle.properties에 있는 키를 기준으로:
 *  - 존재하면 value를 치환
 *  - 존재하지 않으면 끝에 추가
 *
 * (expo prebuild 이후 생성된 android/gradle.properties를 대상으로 실행)
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

function parseGradlePropertiesFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const map = new Map();

  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#') || trimmed.startsWith('!')) continue;

    // key=value or key:value (gradle properties 관례)
    const match = trimmed.match(/^([A-Za-z0-9_.-]+)\s*([:=])\s*(.*)$/);
    if (!match) continue;

    const key = match[1];
    const value = match[3] ?? '';
    map.set(key, value);
  }

  return map;
}

function getPropertyKeyAndValue(line) {
  // returns { key, sep, indent, value } or null
  const match = line.match(/^(\s*)([A-Za-z0-9_.-]+)\s*([:=])\s*(.*?)\s*$/);
  if (!match) return null;
  return {
    indent: match[1] || '',
    key: match[2],
    sep: match[3],
    value: match[4] ?? '',
  };
}

function updateGradleProperties({ sourcePath, targetPath }) {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source gradle.properties not found: ${sourcePath}`);
  }
  if (!fs.existsSync(targetPath)) {
    throw new Error(
      `Target android/gradle.properties not found: ${targetPath}`,
    );
  }

  const updates = parseGradlePropertiesFile(sourcePath);
  const sourceKeys = Array.from(updates.keys());

  const originalText = fs.readFileSync(targetPath, 'utf8');
  const originalLines = originalText.split(/\r?\n/);

  const found = new Set();
  const newLines = [];

  for (const line of originalLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) {
      newLines.push(line);
      continue;
    }

    const parsed = getPropertyKeyAndValue(line);
    if (!parsed) {
      newLines.push(line);
      continue;
    }

    const { indent, key, sep } = parsed;
    if (!updates.has(key)) {
      newLines.push(line);
      continue;
    }

    const newValue = updates.get(key);
    found.add(key);
    newLines.push(`${indent}${key}${sep}${newValue}`);
  }

  const missing = sourceKeys.filter((k) => !found.has(k));
  if (missing.length > 0) {
    // Ensure we don't lose the final newline semantics too aggressively.
    if (newLines.length === 0 || newLines[newLines.length - 1] !== '') {
      newLines.push('');
    }
    newLines.push('# Updated by ci/update-gradle-properties.js (merge)');
    for (const key of missing) {
      newLines.push(`${key}=${updates.get(key)}`);
    }
  }

  const outputText = `${newLines.join('\n')}${originalText.endsWith('\n') ? '' : '\n'}`;
  fs.writeFileSync(targetPath, outputText, 'utf8');

  return {
    updated: sourceKeys.length - missing.length,
    added: missing.length,
    total: sourceKeys.length,
  };
}

function parseArgs(argv) {
  // Minimal argument support (paths override)
  // Example:
  //   node update-gradle-properties.js --source ./ci/gradle.properties --target ./android/gradle.properties
  const args = { source: null, target: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--source') args.source = argv[++i];
    else if (a === '--target') args.target = argv[++i];
  }
  return args;
}

function main() {
  const scriptDir = __dirname; // .../doLink-app-client/ci
  const appRoot = path.resolve(scriptDir, '..'); // .../doLink-app-client

  const { source, target } = parseArgs(process.argv.slice(2));
  const sourcePath = source
    ? path.resolve(source)
    : path.join(scriptDir, 'gradle.properties');
  const targetPath = target
    ? path.resolve(target)
    : path.join(appRoot, 'android', 'gradle.properties');

  const result = updateGradleProperties({ sourcePath, targetPath });
  // CI 로그용
  console.log(
    `update-gradle-properties: total=${result.total}, updated=${result.updated}, added=${result.added}`,
  );
}

main();
