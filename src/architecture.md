---
pageClass: wide
title: Architecture
description: How BlackArch Linux is layered on Arch, built, signed, mirrored and kept up to date.
---

<script setup>
import ArchitectureViz from '@/components/ArchitectureViz.vue'
import ArchJourney from '@/components/ArchJourney.vue'
</script>

# Architecture

BlackArch is not a fork of Arch Linux. It is an **unofficial pacman repository** plus a set of ISO images, built and maintained by a small team of developers. Click through the explorer below, then read the details.

<ArchitectureViz />

## The big picture

<ArchJourney />

## Layers

| Layer | What it is |
| --- | --- |
| Tools | Individual packages; one `packages/<name>/PKGBUILD` each in the [blackarch](https://github.com/BlackArch/blackarch) repo |
| Groups | `blackarch` (everything) and `blackarch-<category>` such as `blackarch-webapp` |
| Repository | `blackarch.db` and packages served under `blackarch.org/blackarch/blackarch/os/<arch>` |
| Keyring | The `blackarch-keyring` package, which `strap.sh` fetches and verifies before trusting the repo |
| Arch Linux | `core`, `extra`, `multilib`, pacman and the rolling base |

Run `strap.sh` once on an Arch install and the repo is added; see [Installation](/install) and [Downloads](/downloads).

## Source repositories

| Repo | Purpose |
| --- | --- |
| [blackarch](https://github.com/BlackArch/blackarch) | PKGBUILDs (`packages/`), release lists (`lists/`), maintainer scripts (`scripts/`), mirror list (`mirror/`) |
| [blackarch-pkgbuilds](https://github.com/BlackArch/blackarch-pkgbuilds) | PKGBUILD templates |
| [blackarch-iso](https://github.com/BlackArch/blackarch-iso) | archiso profile layers and ISO build tooling |
| [blackarch-installer](https://github.com/BlackArch/blackarch-installer) | The official installer |
| [blackarch-site](https://github.com/BlackArch/blackarch-site) | blackarch.org source, including `strap.sh` |

## How a package is built

1. A maintainer writes a PKGBUILD, following the templates.
2. `babuild` builds it in a clean chroot (wrapping Arch's `archbuild` and `makechrootpkg`) so missing build dependencies show up.
3. The package is installed and run in a clean chroot, then on a full BlackArch system to detect file conflicts.
4. `basign` creates detached GPG signatures.
5. `barelease` uploads to the build server, holds a lock, and updates the repository database.

## How mirrors stay in sync

Mirror operators run `syncrepo`. It fetches a small `lastupdate` file over HTTP and only runs `rsync` when the timestamp changed, which saves a large amount of bandwidth. See the [mirror list](/downloads).

## How it stays updated

BlackArch is rolling release. Contributors open pull requests titled `<pkgname>: <change>`; accepted package names go into `lists/to-release`, and a developer with build-server access builds, signs and releases them. Helper scripts such as `outdated`, `pkgver` and `pkgrel` track and bump versions. Users receive updates with `pacman -Syu`.

## How ISOs are assembled

The ISO is built with `archiso`. Layers are merged into a single profile: `full` = base + graphical + full, `slim` = base + graphical + slim, `netinstall` = base + netinstall. Later layers override same-path files and package lists are concatenated.

::: info Sources
Drawn from the public `blackarch`, `blackarch-iso` and `blackarch-site` repositories (`docs/HOWTO-DEV.md`, `scripts/`, `strap.sh`). Internal details of the build server are not public, so this page stays at the level the repositories document. Corrections are welcome via the edit link below.
:::
