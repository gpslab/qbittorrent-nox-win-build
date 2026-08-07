#!/usr/bin/env node
// Sign a release bundle with Ed25519 and emit sidecar files.
//
// Usage: node sign-bundle.js <path-to-zip>
//
// Reads the Ed25519 private key (PEM) from the QBT_NOX_SIGNING_KEY_PEM env var
// (a GitHub Actions secret). The key is never written to disk and never logged.
//
// Produces, next to the zip:
//   <zip>.sig    base64 of the raw 64-byte Ed25519 signature over the zip bytes
//   SHA256SUMS   "<hex sha256>  <zip basename>" (coreutils-compatible)
//
// The signature is crypto.sign(null, <zip bytes>, privateKey), i.e. plain
// Ed25519 over the whole file — no sequence number, no envelope. Consumers pin
// the public key and the version, so there is no rollback vector to defend.

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const zipPath = process.argv[2];
if (!zipPath) {
  console.error('usage: sign-bundle.js <path-to-zip>');
  process.exit(2);
}

const pem = process.env.QBT_NOX_SIGNING_KEY_PEM;
if (!pem || !pem.includes('PRIVATE KEY')) {
  console.error('QBT_NOX_SIGNING_KEY_PEM is missing or is not a PEM private key');
  process.exit(1);
}

let privateKey;
try {
  privateKey = crypto.createPrivateKey(pem);
} catch (e) {
  console.error('failed to parse private key from QBT_NOX_SIGNING_KEY_PEM:', e.message);
  process.exit(1);
}
if (privateKey.asymmetricKeyType !== 'ed25519') {
  console.error(`expected an ed25519 private key, got ${privateKey.asymmetricKeyType}`);
  process.exit(1);
}

const zip = fs.readFileSync(zipPath);
const name = path.basename(zipPath);

const sig = crypto.sign(null, zip, privateKey); // raw 64-byte Ed25519 signature
if (sig.length !== 64) {
  console.error(`unexpected signature length ${sig.length} (expected 64)`);
  process.exit(1);
}
fs.writeFileSync(`${zipPath}.sig`, `${sig.toString('base64')}\n`);

const sha = crypto.createHash('sha256').update(zip).digest('hex');
const sumsPath = path.join(path.dirname(zipPath), 'SHA256SUMS');
fs.writeFileSync(sumsPath, `${sha}  ${name}\n`);

console.log(`signed ${name} (${zip.length} bytes)`);
console.log(`  sha256      : ${sha}`);
console.log(`  sig (base64): ${sig.toString('base64')}`);
console.log(`  wrote       : ${zipPath}.sig`);
console.log(`  wrote       : ${sumsPath}`);
