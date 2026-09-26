import * as React from 'react';
import { Button, Popover } from '@mantine/core';
import { TimePicker } from '@mantine/dates';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import {
  defineMantineEditorPlugin,
  handleMantineEscape,
  type MantineEditorBaseOptions,
  useMantineEditorLifecycle,
} from './shared';

export interface MantineTimePickerEditorPluginOptions extends MantineEditorBaseOptions {
  placeholder?: string;
  minuteStep?: 1 | 5 | 10 | 15 | 20 | 30;
  withSeconds?: boolean;
}

export function createMantineTimePickerEditorPlugin<T>(
  options: MantineTimePickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const initialValue = typeof value === 'string' && value ? value : options.withSeconds ? '09:00:00' : '09:00';
    const [time, setTime] = React.useState(initialValue);
    const lifecycle = useMantineEditorLifecycle(options.openOnMount ?? true, cancel);
    const save = () => {
      lifecycle.markCommitted();
      void commit([{ key: column.key, value: time }]);
    };

    return (
      <Popover
        classNames={{ dropdown: 'bgrid-mantine-editor-popup' }}
        opened={lifecycle.open}
        portalProps={{ target: getPortalContainer() }}
        position='bottom-start'
        offset={0}
        withinPortal
        onChange={lifecycle.onOpenChange}
      >
        <Popover.Target>
          <button
            type='button'
            autoFocus
            className='bgrid-mantine-time-editor'
            aria-label={options.ariaLabel}
            onKeyDown={event => handleMantineEscape(event, cancel)}
          >
            {time || options.placeholder || 'Select time'}
          </button>
        </Popover.Target>
        <Popover.Dropdown>
          <div className='bgrid-mantine-time-popup'>
            <TimePicker
              aria-label={options.ariaLabel}
              minutesStep={options.minuteStep ?? 5}
              popoverProps={{
                classNames: { dropdown: 'bgrid-mantine-editor-popup' },
                portalProps: { target: getPortalContainer() },
                withinPortal: true,
                offset: 0,
              }}
              value={time}
              withDropdown
              {...(options.withSeconds !== undefined ? { withSeconds: options.withSeconds } : {})}
              onChange={setTime}
            />
            <Button fullWidth size='xs' onClick={save}>Apply</Button>
          </div>
        </Popover.Dropdown>
      </Popover>
    );
  }
  Editor.displayName = `MantineTimePickerEditor(${options.id})`;
  return defineMantineEditorPlugin<T>({ id: options.id, component: Editor });
}
