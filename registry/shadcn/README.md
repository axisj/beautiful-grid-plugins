# BeautifulGrid Shadcn Registry

Source-distributed Shadcn editor integrations for BeautifulGrid live here.

Install the complete editor collection with the Shadcn CLI:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/axisj/beautiful-grid-plugins/main/public/r/beautiful-grid-editors.json
```

The item installs Select, DatePicker, ColorPicker, Cascader, TimePicker, and
TreeSelect factories under `components/beautiful-grid`. Import the generated
stylesheet once in your application entry point:

```tsx
import '@/components/beautiful-grid/beautiful-grid-editors.css';
```

Create an editor and assign it to an editable BeautifulGrid column:

```tsx
import { createShadcnSelectEditorPlugin } from '@/components/beautiful-grid';

const statusEditor = createShadcnSelectEditorPlugin<Order, Order['status']>({
  id: 'order-status',
  ariaLabel: 'Select order status',
  options: [
    { value: 'ready', label: 'Ready' },
    { value: 'shipped', label: 'Shipped' },
  ],
});
```

Run `pnpm registry:build` after changing a registry source file. Commit the
generated `public/r/beautiful-grid-editors.json` so the raw GitHub URL remains
installable.

## License

The registry source is licensed under Apache-2.0. See the repository
[LICENSE](../../LICENSE), [NOTICE](../../NOTICE), and
[third-party notices](../../THIRD_PARTY_NOTICES.md). Radix UI and Lucide remain
separately distributed dependencies under their respective licenses.
