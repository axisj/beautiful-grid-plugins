# Gates: production-ready editor plugin migration

OWNS: LICENSE, GATES.md, README.md, package.json, pnpm-lock.yaml, tsconfig.base.json, scripts/**, tests/**, packages/antd/**, packages/mui/package.json, packages/mui/LICENSE, packages/mantine/package.json, packages/mantine/LICENSE, public/**, registry.json, registry/shadcn/**

Scope: Harden the plugin monorepo and ship complete Ant Design and Shadcn editor integrations migrated from BeautifulGrid without changing the manual initial-publish workflow.

- [x] G0: this ledger defines executable outcome checks without structural errors
  CHECK: node /Users/tom/.agents/skills/unlazy/scripts/gate-lint.mjs GATES.md
  EXPECT: LINT OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=67da5b2427f3/34 entries; EXPECT=matched; output-sha256=48630b7361dd44ee870917b12c3d19b9d7bdea738aaca16bb04d4cab83b772d2; output-bytes=8

- [x] G1: all workspace source typechecks and automated editor tests pass
  CHECK: pnpm test && pnpm typecheck && node -e "console.log('editor tests and typecheck passed')"
  EXPECT: editor tests and typecheck passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=67da5b2427f3/34 entries; EXPECT=matched; output-sha256=4765c6545fecf38d8ad29cb051337a50bf0150d01124c3645c1c6bc40de07e03; output-bytes=4280

- [x] G2: all npm packages build and their declared ESM, CJS, type, CSS, and license artifacts are publishable
  CHECK: pnpm build && pnpm verify:packages && node -e "console.log('package artifacts verified')"
  EXPECT: package artifacts verified
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=67da5b2427f3/34 entries; EXPECT=matched; output-sha256=42db06510a081e1aa1d8f4e25b96acfb4ee3340c6d03fa3b695a28e2414c8334; output-bytes=3379

- [x] G3: the Shadcn registry contains installable editor source and passes registry validation
  CHECK: pnpm registry:validate && pnpm verify:registry && node -e "console.log('shadcn registry verified')"
  EXPECT: shadcn registry verified
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=67da5b2427f3/34 entries; EXPECT=matched; output-sha256=716781b5f55add1de6d29c1f286bfcab274cc31f0ed390b3073238c005fe3c95; output-bytes=460

- [x] G4: repository changes contain no whitespace errors and the full project check succeeds
  CHECK: git diff --check && pnpm check && node -e "console.log('repository verification passed')"
  EXPECT: repository verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/tom/Development/axisj/beautiful-grid-plugins; path=67da5b2427f3/34 entries; EXPECT=matched; output-sha256=d4253e5ae4bf41d8b34acfc1e632f22220978251551d9a0098fd1d936f331fbe; output-bytes=5071
