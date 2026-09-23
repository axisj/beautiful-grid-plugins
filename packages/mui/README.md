# @beautifuljs/grid-mui

Material UI editor integrations for [BeautifulGrid](https://bgrid.axisj.com).

## Installation

```sh
pnpm add @beautifuljs/grid-mui @mui/material @mui/x-date-pickers @emotion/react @emotion/styled beautiful-grid react react-dom
```

Import the plugin stylesheet once in your application entry point:

```tsx
import '@beautifuljs/grid-mui/style.css';
```

The package provides Select, DatePicker, ColorPicker, and TimePicker editor
factories. Cascader and TreeSelect are intentionally outside this integration's
scope.

```tsx
import { createMuiSelectEditorPlugin } from '@beautifuljs/grid-mui';

const statusEditor = createMuiSelectEditorPlugin<Order, Order['status']>({
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

This package targets the MIT-licensed MUI X Community package
`@mui/x-date-pickers`; Pro and Premium packages are not included. See
[NOTICE](./NOTICE) and [third-party notices](./THIRD_PARTY_NOTICES.md).
