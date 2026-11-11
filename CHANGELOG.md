# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Daily and manual deploys: `main-ci` runs every day and on demand, and syncs the tools list from
  the BlackArch package database before each deploy.
- `pnpm sync:tools` rebuilds the whole tools list from the package database, replacing the separate
  version, build-date and group scripts.
- `SITE_URL` sets the address the site is built for, so it can be built for another domain.
- FAQ structured data (`FAQPage`) for the English and Italian FAQ.

- New terminal-style theme (dark by default): wide pages that use the full screen, a collapsible
  sidebar, and design tokens in `theme/styles/`.
- Animated hero logo: the sword slides in, the neon arch ignites and breathes, and light sweeps
  across both. It is static for visitors who prefer reduced motion.
- Home page with a copyable install command, key facts and a screenshot viewer.
- Architecture page with an interactive explorer (layers, build pipeline, update flow, ISO layers)
  and a journey diagram of how a tool reaches the user.
- Community & News page with channel cards, a news timeline and team cards. Team members show
  their GitHub avatar and a copyable GPG key.
- Donate page with a PayPal / Bitcoin switch, a Bitcoin QR code and a ranked supporters list.
- Searchable FAQ with categories and copyable commands.
- Tools page: category filters based on the real package groups from the BlackArch wiki,
  expandable rows, a copy button for the install command, and a Docs link for tools that have a
  wiki page.
- Tools page sorting: A–Z, Most popular (GitHub stars of the upstream repository) and Recently
  updated (build date from the official package database); tools without that value sort last. Several categories can be selected at
  once, and the category chips wrap instead of scrolling sideways.
- MIT license for the website code.
- Search and link previews: a sitemap of the real pages, a social preview image, canonical
  addresses, `hreflang` links between language versions, structured data on the home pages,
  a description for every page and clean URLs without `.html`. Untranslated language pages point
  search engines at the English page.
- A weekly `refresh-data` workflow that runs the data scripts and opens a pull request.
- Guide page: the PDF guides as language cards.
- Downloads page documents the official Docker images (BlackArch/blackarch-site#192).
- Language switcher with 14 languages: Arabic (right-to-left), Armenian, Brazilian Portuguese,
  Chinese, French, German, Greek, Indonesian, Italian, Portuguese, Romanian, Russian, Spanish and
  Turkish. The interface and search are translated; Italian has full page translations.
- Scripts to refresh the mirror list (`pnpm sync:mirrors`) and the tool groups (`pnpm sync:wiki`),
  and to generate language page stubs (`pnpm gen:locales`).
- Tooling: Prettier, oxlint, an `.editorconfig`, and husky hooks that format and lint staged files
  and check commit messages with commitlint. `pnpm check` runs everything CI runs.
- CI now checks formatting, lint, generated language pages and commit messages, installs from the
  frozen lockfile, and deploys exactly the commit that passed.
- README with setup, project layout, conventions, translation workflow and data maintenance.

### Changed

- The site colour is now blue instead of red, to match the BlackArch logo and desktop themes. All
  components take it from the `--ba-accent` tokens.
- The favicon is now the blue one used by blackarch.org.
- The tools list follows the package database: 94 tools added, 75 removed.

- Downloads page lists only the Slim and NetInstall ISOs as cards with version, size, copyable
  SHA1 and torrent links. Full ISO and OVA are no longer listed.
- Mirror list rebuilt from the official list on blackarch.org: 128 mirrors in 27 countries, with
  protocol labels and copy buttons.
- Header social links: the Twitter icon is now the X logo; YouTube and RSS moved to the
  Community & News page.
- Security policy now asks for private vulnerability reports instead of public issues.
- Code organisation: shared `useClipboard` composable, static data moved to `src/data`, theme
  styles split into `tokens`, `base`, `layout` and `rtl`, and component styles use CSS logical
  properties so right-to-left languages need no overrides.

### Fixed

- Tool versions now come from the BlackArch package database: 610 were out of date.

- Security updates for dependencies flagged by Dependabot: Vue and VitePress updated, and patched
  versions of Vite, Rollup, Preact and mdast-util-to-hast pinned through pnpm overrides.

- Tool links: 587 updated (current upstream URLs from the BlackArch package database, Google Code
  projects resolved through the Google Code archive, permanent redirects followed). Tools whose
  website is gone show a "Dead link" tag and a search link instead.

- FAQ no longer recommends installing every tool at once; the update command is `pacman -Syu`
  (BlackArch/blackarch-site#191).
- ISO cards and the `strap.sh` check now give SHA-256 (and SHA3-256 for the ISOs) next to the
  official SHA1 (BlackArch/blackarch-site#187). The values were computed from files whose SHA1
  matches the one published on blackarch.org.
- ISO release dates use the ISO 8601 format, for example `2023-05-01`
  (BlackArch/blackarch-site#143).

- `strap.sh` checksum on the downloads page now matches the file published on blackarch.org.
- Removed an unrelated OPNsense mirror that appears in the official list.

### Removed

- Unused `DataTable` and `LazyImage` components and the legacy `src/data/tools.json`.
- The separate News page: `/news` redirects to the Community & News page.

## Earlier history

Changes before this changelog, taken from the git history:

- **2026-07-16**: full installation tutorial with screenshots, lazy-loaded tools list, mirror
  search, a tools table layout fix, and the GitHub Pages base path.
- **2025-05 to 2025-06**: deploy workflow, countries shown as dropdowns, missing links fixed,
  improved search.
- **2024-10-27**: first release.
