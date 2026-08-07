qbittorrent-nox for Windows x64
===============================

This archive contains the headless qBittorrent client (qbittorrent-nox), an
upstream component of qBittorrent (https://www.qbittorrent.org/), compiled for
Windows x64. Upstream does not ship a headless Windows build; this is a
CI/packaging build of that upstream dependency.

Contents
--------
  qbittorrent-nox.exe      the headless client (WebUI enabled, no GUI)
  Qt6*.dll, plugins/       Qt 6 runtime (dynamic, replaceable DLLs)
  qt.conf                  tells Qt where the bundled plugins are
  *CRT DLLs                Microsoft Visual C++ runtime
  THIRD-PARTY-LICENSES/    license texts and copyright for every component

Running
-------
  Unzip anywhere and run:
      qbittorrent-nox.exe
  The WebUI is available on http://localhost:8080 by default. On first run the
  program prints a temporary admin password to the console. See
  https://github.com/qbittorrent/qBittorrent/wiki for usage.

Licensing
---------
  qbittorrent-nox is Free Software under the GNU GPL. Qt 6 is used under LGPLv3
  as replaceable dynamic DLLs. Full license texts and copyright notices for all
  bundled components (qBittorrent, Qt, libtorrent-rasterbar, boost, OpenSSL,
  zlib, MSVC runtime) are in the THIRD-PARTY-LICENSES/ directory.

  Build recipe and corresponding source pointers:
  https://github.com/gpslab/qbittorrent-nox-win-build
