# Third-party licenses

The `qbittorrent-nox` bundle published by this repository incorporates the
following Free/Open-Source components. Each is listed with its license and the
location of the full license text. All texts are shipped inside every release
archive. The exact resolved versions for a given release are also written to
`versions.txt` inside the bundle.

| Component            | Version (pinned/resolved) | License                 | Linkage in bundle        | Full text / notice                              |
|----------------------|---------------------------|-------------------------|--------------------------|-------------------------------------------------|
| qBittorrent          | release-5.2.3             | GPLv2-or-later (→GPLv3) | the `-nox` executable    | `texts/GPL-3.0.txt`, `texts/GPL-2.0.txt`, `qBittorrent-NOTICE.txt` |
| Qt 6                 | 6.10.3                    | LGPLv3                  | dynamic, replaceable DLL | `texts/LGPL-3.0.txt`, `texts/GPL-3.0.txt`, `Qt6-LGPL-NOTICE.txt`   |
| PCRE2 (inside Qt6Core)| bundled with Qt 6.10.3   | BSD-3-Clause            | static (inside Qt6Core)  | `texts/PCRE2-BSD.txt`, `Qt-third-party-NOTICE.txt` |
| SQLite (inside qsqlite)| bundled with Qt 6.10.3  | Public domain           | inside `qsqlite.dll`     | `SQLite-NOTICE.txt`                             |
| libtorrent-rasterbar | 2.0.13                    | BSD-3-Clause            | static (linked into exe) | `texts/libtorrent-BSD.txt`                      |
| boost                | 1.91.0                    | BSL-1.0                 | static (linked into exe) | `texts/BSL-1.0.txt`                             |
| OpenSSL              | 3.6.3                     | Apache-2.0              | static (linked into exe) | `texts/Apache-2.0.txt`, `OpenSSL-NOTICE.txt`    |
| zlib                 | 1.3.2                     | zlib license            | static (linked into exe) | `texts/zlib.txt`                                |
| MS Visual C++ runtime| VC14x redist              | Microsoft VS license    | dynamic DLL              | `MSVC-runtime-NOTICE.txt`                       |

Resolved versions above (OpenSSL 3.6.3, zlib 1.3.2) are confirmed from the CI
build log; qBittorrent/Qt/libtorrent/boost are pinned in the workflow matrix.

## Corresponding source (GPL / LGPL)

- **qBittorrent (GPL):** the corresponding source is upstream qBittorrent at the
  pinned tag `release-5.2.3`
  (<https://github.com/qbittorrent/qBittorrent/tree/release-5.2.3>) together with
  the build recipe in this repository (`.github/workflows/build-nox.yml`). No
  source patches are applied.
- **Qt 6 (LGPLv3):** Qt is bundled as **dynamic, replaceable DLLs**, so an end
  user may substitute a modified Qt build. Corresponding source is upstream Qt
  6.10.3 (<https://download.qt.io/archive/qt/6.10/6.10.3/>). See
  `Qt6-LGPL-NOTICE.txt`. Third-party code compiled into Qt (e.g. PCRE2) is
  attributed in `Qt-third-party-NOTICE.txt`.

## OpenSSL version

The exact OpenSSL version is resolved by vcpkg at build time and printed by the
**Record dependency versions** step of the workflow run, and written to
`versions.txt` in the bundle. For the current releases it is **OpenSSL 3.6.3**
(Apache-2.0, `OpenSSL-NOTICE.txt`). If a build ever resolves to OpenSSL 1.1.x
(dual OpenSSL/SSLeay license), update this table and add the corresponding text.
