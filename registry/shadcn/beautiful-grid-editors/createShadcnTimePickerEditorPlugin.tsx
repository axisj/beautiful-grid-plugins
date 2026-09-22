import * as React from 'react';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { Clock } from 'lucide-react';
import { EditorPopover, EditorPopoverContent, EditorPopoverTrigger } from './editor-popover';
import { defineEditorPlugin, EditorTrigger, type BaseOptions, useEditorLifecycle } from './shared';

export interface ShadcnTimePickerEditorPluginOptions extends BaseOptions {
  minuteStep?: 1 | 5 | 10 | 15 | 20 | 30;
}

export function createShadcnTimePickerEditorPlugin<T>(
  options: ShadcnTimePickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  const step = options.minuteStep ?? 5;
  const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
  const minutes = Array.from({ length: 60 / step }, (_, index) => String(index * step).padStart(2, '0'));
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(cancel);
    const [hour, setHour] = React.useState(typeof value === 'string' && /^\d{2}:\d{2}$/.test(value) ? value.slice(0, 2) : '09');
    const [minute, setMinute] = React.useState(typeof value === 'string' && /^\d{2}:\d{2}$/.test(value) ? value.slice(3) : '00');
    return (
      <EditorPopover open={lifecycle.open} onOpenChange={lifecycle.onOpenChange}>
        <EditorPopoverTrigger asChild>
          <EditorTrigger ariaLabel={options.ariaLabel} cancel={cancel} icon={<Clock />}>
            {typeof value === 'string' && value ? value : options.placeholder ?? 'Select time'}
          </EditorTrigger>
        </EditorPopoverTrigger>
        <EditorPopoverContent container={getPortalContainer()} className='w-56' align='start'>
          <div className='bgrid-shadcn-time-columns'>
            <label>Hour<select value={hour} onChange={event => setHour(event.target.value)}>{hours.map(item => <option key={item}>{item}</option>)}</select></label>
            <label>Minute<select value={minute} onChange={event => setMinute(event.target.value)}>{minutes.map(item => <option key={item}>{item}</option>)}</select></label>
          </div>
          <button
            type='button'
            className='bgrid-shadcn-primary-button'
            onClick={() => {
              lifecycle.commitStarted();
              void commit([{ key: column.key, value: `${hour}:${minute}` }]);
            }}
          >
            Apply
          </button>
        </EditorPopoverContent>
      </EditorPopover>
    );
  }
  Editor.displayName = `ShadcnTimePickerEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

