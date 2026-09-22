# BeautifulGrid Plugins

Official plugins and integrations for [BeautifulGrid](https://bgrid.axisj.com).

## Packages

| Package | Description |
| --- | --- |
| [`@axisj/beautiful-grid-antd`](./packages/antd) | Ant Design editor integrations for BeautifulGrid |

## Development

This repository uses pnpm workspaces and Changesets.

```sh
pnpm install
pnpm build
pnpm typecheck
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

## License

Apache-2.0
