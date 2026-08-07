# Release signing

Every release archive is signed with **Ed25519**. Each release carries three
files:

| Asset                                   | Meaning                                                        |
|-----------------------------------------|----------------------------------------------------------------|
| `qbittorrent-nox-<ver>-win-x64.zip`     | The bundle itself                                              |
| `qbittorrent-nox-<ver>-win-x64.zip.sig` | Base64 of the raw 64-byte Ed25519 signature over the zip bytes |
| `SHA256SUMS`                            | `sha256(zip)  <zip name>`, coreutils-compatible                |

The signing public key is committed to this repo as
[`signing-key.pub`](signing-key.pub) (PEM). The matching private key is a GitHub
Actions secret (`QBT_NOX_SIGNING_KEY_PEM`); signing and self-verification run in
CI on every build. There is no signature sequence number — consumers are
expected to pin both this public key and a specific release version, so there is
no rollback vector to guard against.

## Verify with OpenSSL

The `.sig` is raw Ed25519, so decode the base64 first, then verify with
`-rawin`:

```sh
# 1. sha256 (optional, matches SHA256SUMS)
sha256sum -c SHA256SUMS

# 2. signature
base64 -d qbittorrent-nox-<ver>-win-x64.zip.sig > sig.raw
openssl pkeyutl -verify -pubin -inkey signing-key.pub \
  -rawin -in qbittorrent-nox-<ver>-win-x64.zip -sigfile sig.raw
# -> "Signature Verified Successfully"
```

## Verify with Node

```js
const fs = require('fs');
const crypto = require('crypto');

const zip = fs.readFileSync('qbittorrent-nox-<ver>-win-x64.zip');
const sig = Buffer.from(fs.readFileSync('qbittorrent-nox-<ver>-win-x64.zip.sig', 'utf8').trim(), 'base64');
const pub = crypto.createPublicKey(fs.readFileSync('signing-key.pub', 'utf8'));

const ok = crypto.verify(null, zip, pub, sig); // true on a good signature
if (!ok) throw new Error('signature verification failed');
```

`crypto.verify(null, ...)` selects Ed25519 automatically from the key type; this
is the same call the build performs against `signing-key.pub` before publishing.
