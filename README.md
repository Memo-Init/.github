# memo-init / .github

Organization profile for the **memo-init** GitHub org. Renders `profile/README.md` from
`src/data/template.txt` + synced `refs.json` via [BadgeTable](https://github.com/a6b8/badgeTable).

- `index.mjs` — template + refs → `BadgeTable().getTable({ preset, projects })` → `profile/README.md`
- `src/data/config.mjs` — repo groups (one group for the minimal bootstrap)
- `scripts/fetch-refs.mjs` — pulls `refs.resolved.json` from the `spec` repo
- `.github/workflows/update-readme.yaml` — regenerates on push + `repository_dispatch: refs-updated`

`profile/README.md` is **generated** — do not edit by hand.

License: MIT
