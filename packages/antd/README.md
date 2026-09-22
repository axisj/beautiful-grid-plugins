# @beautifuljs/grid-antd

Ant Design editor integrations for [BeautifulGrid](https://bgrid.axisj.com).

## Installation

```sh
pnpm add @beautifuljs/grid-antd antd beautiful-grid react react-dom
```

Import the integration stylesheet once in your application entry point:

```tsx
import '@beautifuljs/grid-antd/style.css';
```

## Usage

```tsx
import { createAntdSelectEditorPlugin } from '@beautifuljs/grid-antd';

const statusEditor = createAntdSelectEditorPlugin<Order, Order['status']>({
  id: 'order-status',
  ariaLabel: 'Select order status',
  options: [
    { value: 'ready', label: 'Ready' },
    { value: 'shipped', label: 'Shipped' },
  ],
});

const columns = [
  {
    key: 'status',
    label: 'Status',
    width: 140,
    editable: true,
    editor: statusEditor,
  },
];
```

The package exports factories for Select, DatePicker, ColorPicker, Cascader,
TimePicker, and TreeSelect. Cascader integrations can use
`formatCascaderClipboardText` and `parseCascaderClipboardText` to define the
column clipboard contract.

## License

Apache-2.0

See [NOTICE](./NOTICE) and [third-party notices](./THIRD_PARTY_NOTICES.md).
