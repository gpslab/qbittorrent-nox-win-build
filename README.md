# qbittorrent-nox-win-build

CI build of the headless client **`qbittorrent-nox`** — an upstream component of
[qBittorrent](https://www.qbittorrent.org/) — for **Windows x64**.

The qBittorrent project does not publish a headless (`-nox`) build for Windows;
official Windows releases ship only the GUI client. This repository compiles the
`qbittorrent-nox` executable from pinned upstream sources and publishes a
ready-to-run, self-contained bundle as a GitHub Release. It is a build/packaging
repository, in the same spirit as a distribution recipe: it vendors an upstream
dependency, it adds no functionality of its own.

## What is built

A single executable, `qbittorrent-nox.exe`, plus the runtime files needed to run
it on a clean Windows x64 machine:

| File / dir              | Purpose                                                        |
|-------------------------|----------------------------------------------------------------|
| `qbittorrent-nox.exe`   | The headless qBittorrent client (WebUI enabled, GUI disabled)  |
| `Qt6*.dll`, `plugins/`  | Qt 6 runtime (dynamic, replaceable — see LGPL note below)      |
| `qt.conf`               | Points Qt at the bundled `plugins/` directory                  |
| `MSVC*.dll`, `VCRUNTIME*.dll` | Microsoft Visual C++ runtime redistributable             |
| `THIRD-PARTY-LICENSES/` | Full license texts and copyright for every bundled component   |

## Pinned versions

| Component               | Version                          |
|-------------------------|-----------------------------------|
| qBittorrent             | `release-5.2.3`                  |
| libtorrent-rasterbar    | `2.0.13` (static)                |
| Qt                      | `6.10.3` (`win64_msvc2022_64`)   |
| boost                   | `1.91.0`                         |
| OpenSSL, zlib           | via vcpkg (see build log / `THIRD-PARTY-LICENSES/`) |
| Toolchain               | MSVC 2022                        |

Bundle contents and exact dependency versions are printed by the **Collect facts**
and **Record dependency versions** steps of each workflow run.

## How to build / reproduce

Everything is driven by [`.github/workflows/build-nox.yml`](.github/workflows/build-nox.yml)
on `windows-latest`:

1. Checkout upstream qBittorrent at the pinned tag.
2. Set up MSVC 2022 + Ninja.
3. Install OpenSSL, zlib and boost-build via vcpkg (`static-md` triplet).
4. Install Qt via `aqtinstall`.
5. Build libtorrent-rasterbar statically.
6. Configure qBittorrent with `-DGUI=OFF -DWEBUI=ON` and build `qbittorrent-nox`.
7. Assemble the bundle, run a headless smoke test against the WebUI API, and
   publish the zip.

Trigger a build manually via **Actions → build-nox → Run workflow**
(`workflow_dispatch`), or open a pull request to run the build as validation.

## Releases

Pushing a tag of the form `qbt-nox-<qbt-version>+<build>` (for example
`qbt-nox-5.2.3+1`) builds the bundle and publishes it as a GitHub Release with the
zip attached. Download the latest archive from the
[Releases](../../releases) page, unzip anywhere, and run `qbittorrent-nox.exe`.

## Licensing

`qbittorrent-nox` and its dependencies are Free/Open-Source software. The build
scripts and workflow in **this** repository are licensed under
[MIT](LICENSE). That MIT license covers only the scripts here — it grants no
rights over the compiled upstream binaries, which remain under their own
licenses.

The published bundle contains software under **GPL** (qBittorrent), **LGPLv3**
(Qt 6), **BSD-3-Clause** (libtorrent-rasterbar), **BSL-1.0** (boost), plus OpenSSL
and zlib licenses, and the Microsoft Visual C++ runtime. Full license texts and
copyright notices for every bundled component are in
[`THIRD-PARTY-LICENSES/`](THIRD-PARTY-LICENSES/) and are shipped inside every
release archive.

- **qBittorrent** is licensed GPLv2-or-later; it is redistributed here under
  GPLv3. This public repository — pinned upstream tag plus the build recipe —
  serves as the corresponding source.
- **Qt 6** is bundled as **dynamic, replaceable DLLs** (not statically linked),
  preserving the LGPLv3 right to relink against a modified Qt. See
  [`THIRD-PARTY-LICENSES/Qt6-LGPL-NOTICE.txt`](THIRD-PARTY-LICENSES/Qt6-LGPL-NOTICE.txt).
