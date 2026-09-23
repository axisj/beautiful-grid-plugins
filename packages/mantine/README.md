# @beautifuljs/grid-mantine

Mantine editor integrations for [BeautifulGrid](https://bgrid.axisj.com).

## Installation

```sh
pnpm add @beautifuljs/grid-mantine @mantine/core @mantine/dates beautiful-grid react react-dom
```

Import the plugin stylesheet once in your application entry point:

```tsx
import '@beautifuljs/grid-mantine/style.css';
```

The package provides Select, DatePicker, ColorPicker, and TimePicker editor
factories. Cascader and TreeSelect are intentionally outside this integration's
scope.

```tsx
import { createMantineSelectEditorPlugin } from '@beautifuljs/grid-mantine';

const statusEditor = createMantineSelectEditorPlugin<Order, Order['status']>({
  id: 'order-status',
  ariaLabel: 'Select order status',
  options: [
    { value: 'ready', label: 'Ready' },
    { value: 'shipped', label: 'Shipped' },
  ],
});
```

Assign the returned config to an editable BeautifulGrid column's `editor`.
Popup content is rendered into BeautifulGrid's floating portal root.

## License

Apache-2.0

See [NOTICE](./NOTICE) and [third-party notices](./THIRD_PARTY_NOTICES.md).
