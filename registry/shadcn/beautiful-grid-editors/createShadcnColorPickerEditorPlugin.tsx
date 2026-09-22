import * as React from 'react';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { Check } from 'lucide-react';
import { EditorPopover, EditorPopoverContent, EditorPopoverTrigger } from './editor-popover';
import { defineEditorPlugin, EditorTrigger, type BaseOptions, useEditorLifecycle } from './shared';

const DEFAULT_COLORS = [
  '#0F172A', '#64748B', '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
  '#6366F1', '#8B5CF6', '#D946EF', '#F43F5E', '#1677FF', '#13C2C2', '#52C41A', '#FA8C16',
];

export interface ShadcnColorPickerEditorPluginOptions extends BaseOptions {
  colors?: string[];
  fallbackColor?: string;
}

export function createShadcnColorPickerEditorPlugin<T>(
  options: ShadcnColorPickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  const palette = options.colors ?? DEFAULT_COLORS;
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(cancel);
    const initial = typeof value === 'string' && value ? value : options.fallbackColor ?? '#3B82F6';
    const [custom, setCustom] = React.useState(initial);
    const save = (color: string) => {
      const normalized = color.startsWith('#') ? color : `#${color}`;
      if (!/^#[\dA-Fa-f]{3}([\dA-Fa-f]{3})?$/.test(normalized)) return;
      lifecycle.commitStarted();
      void commit([{ key: column.key, value: normalized.toUpperCase() }]);
    };
    return (
      <EditorPopover open={lifecycle.open} onOpenChange={lifecycle.onOpenChange}>
        <EditorPopoverTrigger asChild>
          <EditorTrigger ariaLabel={options.ariaLabel} cancel={cancel}>
            {initial.toUpperCase()} <span className='bgrid-shadcn-color-swatch' style={{ backgroundColor: initial }} />
          </EditorTrigger>
        </EditorPopoverTrigger>
        <EditorPopoverContent container={getPortalContainer()} className='w-64' align='start'>
          <div className='bgrid-shadcn-palette'>
            {palette.map(color => (
              <button key={color} type='button' aria-label={`Color ${color}`} style={{ backgroundColor: color }} onClick={() => save(color)}>
                {initial.toUpperCase() === color.toUpperCase() ? <Check /> : null}
              </button>
            ))}
          </div>
          <form className='bgrid-shadcn-inline-form' onSubmit={event => { event.preventDefault(); save(custom); }}>
            <input aria-label='Custom HEX color' value={custom} onChange={event => setCustom(event.target.value)} placeholder='#000000' />
            <button type='submit'>Apply</button>
          </form>
        </EditorPopoverContent>
      </EditorPopover>
    );
  }
  Editor.displayName = `ShadcnColorPickerEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

