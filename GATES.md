# Gates: MUI and Mantine editor integrations

OWNS: GATES.md, README.md, package.json, pnpm-lock.yaml, scripts/**, tests/**, packages/mui/**, packages/mantine/**, .changeset/**

Scope: Implement production-ready Select, DatePicker, ColorPicker, and TimePicker integrations for MUI and Mantine while excluding Cascader and TreeSelect.

- [x] G0: this ledger defines executable outcome checks without structural errors
  CHECK: node /Users/tom/.agents/skills/unlazy/scripts/gate-lint.mjs GATES.md
  EXPECT: LINT OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=35795f1e44af/34 entries; EXPECT=matched; output-sha256=48630b7361dd44ee870917b12c3d19b9d7bdea738aaca16bb04d4cab83b772d2; output-bytes=8

- [x] G1: MUI and Mantine expose exactly the four requested editor factory families and their factory tests pass
  CHECK: pnpm test && node -e "console.log('integration factory tests passed')"
  EXPECT: integration factory tests passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=35795f1e44af/34 entries; EXPECT=matched; output-sha256=02ab7ce7ecb4659abba7a9422f7fa51120712f81207a7abf5ee6b6ea6582f7b3; output-bytes=4595

- [x] G2: all integration source and Shadcn registry source typecheck
  CHECK: pnpm typecheck && node -e "console.log('integration typecheck passed')"
  EXPECT: integration typecheck passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=35795f1e44af/34 entries; EXPECT=matched; output-sha256=202e3502e0f241db715a657256cf09ad1f095be99ddf7e05819e758857a983df; output-bytes=590

- [x] G3: MUI and Mantine are publishable and their artifacts contain runtime, type, style, documentation, and license files without excluded APIs
  CHECK: pnpm build && pnpm verify:packages && node -e "console.log('integration packages verified')"
  EXPECT: integration packages verified
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=35795f1e44af/34 entries; EXPECT=matched; output-sha256=3aed45e511d6f0fae643f4392d27f5ca0e56e5f7f5df494c043e68d13c047cee; output-bytes=3816

- [x] G4: the complete repository verification succeeds with current generated Registry artifacts
  CHECK: pnpm check && node -e "console.log('repository verification passed')"
  EXPECT: repository verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=35795f1e44af/34 entries; EXPECT=matched; output-sha256=b52f5cb048162c29852735326d40ac45794db124425c9b8426f02c71bb2a68d4; output-bytes=5946

- [x] G5: repository changes contain no whitespace errors
  CHECK: git diff --check && node -e "console.log('diff verification passed')"
  EXPECT: diff verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=35795f1e44af/34 entries; EXPECT=matched; output-sha256=1c7f5d6a476f95628d2d42ded372e5eff17f65774d1885ca6eaa809e3ea4ecea; output-bytes=25
