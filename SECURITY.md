# Security Policy

This repository contains the source of a **static website**. It has no server-side code, accounts
or database. The published site is rebuilt from the `main` branch and deployed to GitHub Pages.

## Supported versions

Only the latest commit on `main`, which is what is deployed, is supported. Fixes are not
backported.

## What to report

Please report anything that could harm visitors or the project, for example:

- cross-site scripting or content injection in a page or component
- a link, download or checksum that points somewhere it should not (for example a modified ISO
  URL, torrent, `strap.sh` checksum or Bitcoin address)
- a dependency or build/deploy workflow problem that could lead to a compromised build
- secrets or credentials committed to the repository

**Not in scope:** vulnerabilities in BlackArch Linux itself, its packages or its tools. Those are
handled by the BlackArch project: <https://github.com/BlackArch/blackarch>.

## How to report

Please **do not open a public issue** for a vulnerability.

Use GitHub's private reporting:
[Report a vulnerability](https://github.com/ru44/blackarch-website/security/advisories/new)
(Security tab, "Report a vulnerability").

Include, as far as you can:

- what the problem is and which page or file it affects
- steps to reproduce it
- the impact you expect
- your contact details if you would like updates (optional)

## What to expect

This is a volunteer project. We will read every report, tell you whether we consider it a
vulnerability, and keep you informed while we fix it. Please give us a reasonable time to fix the
problem before you disclose it publicly; we are happy to credit you in the fix if you want that.
There is no bug bounty.
