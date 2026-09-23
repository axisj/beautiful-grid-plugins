# BeautifulGrid Plugins

Official plugins and integrations for [BeautifulGrid](https://bgrid.axisj.com).

## Packages

| Package | Status | Description |
| --- | --- | --- |
| [`@beautifuljs/grid-antd`](./packages/antd) | Published | Ant Design editor integrations for BeautifulGrid |
| [`@beautifuljs/grid-mui`](./packages/mui) | Ready to publish | Material UI Select, DatePicker, ColorPicker, and TimePicker integrations |
| [`@beautifuljs/grid-mantine`](./packages/mantine) | Ready to publish | Mantine Select, DatePicker, ColorPicker, and TimePicker integrations |

Shadcn integrations are distributed as source code through the
[`registry/shadcn`](./registry/shadcn) registry instead of npm.

The Ant Design package currently includes Select, DatePicker, ColorPicker,
Cascader, TimePicker, and TreeSelect editor factories. The Shadcn registry item
provides the same six editor types as installable source.

The MUI and Mantine packages intentionally support four editor types: Select,
DatePicker, ColorPicker, and TimePicker. Cascader and TreeSelect are outside
their integration scope.

## Development

This repository uses pnpm workspaces and Changesets.

```sh
pnpm install
pnpm check
```

Rebuild the committed Shadcn registry artifacts after editing registry source:

```sh
pnpm registry:build
```

Create a release note for a publishable change:

```sh
pnpm changeset
```

Apply the selected version bumps and publish packages:

```sh
pnpm version-packages
pnpm release
```

The release workflow creates or updates a version PR when a changeset is pushed
to `main`. Merging that PR publishes changed npm packages through npm Trusted
Publishing (OIDC), without a long-lived npm token.

Each package must be published once before its Trusted Publisher can be
configured on npm. After the initial publish, add a GitHub Actions publisher to
each npm package with organization `axisj`, repository
`beautiful-grid-plugins`, and workflow filename `release.yml`.

## License

Apache-2.0

See [NOTICE](./NOTICE) for BeautifulGrid attribution and
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for the licenses of external
integration dependencies. Third-party project names identify compatibility and
do not imply sponsorship or endorsement.
