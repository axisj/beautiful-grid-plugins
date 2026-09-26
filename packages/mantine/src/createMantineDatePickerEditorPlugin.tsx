import * as React from 'react';
import { Popover } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import {
  defineMantineEditorPlugin,
  handleMantineEscape,
  type MantineEditorBaseOptions,
  useMantineEditorLifecycle,
} from './shared';

export interface MantineDatePickerEditorPluginOptions extends MantineEditorBaseOptions {
  min?: string;
  max?: string;
  placeholder?: string;
}

export function createMantineDatePickerEditorPlugin<T>(
  options: MantineDatePickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const initialValue = typeof value === 'string' && value ? value : null;
    const lifecycle = useMantineEditorLifecycle(options.openOnMount ?? true, cancel);
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
            className='bgrid-mantine-date-editor'
            aria-label={options.ariaLabel}
            onKeyDown={event => handleMantineEscape(event, cancel)}
          >
            {initialValue || options.placeholder || 'Select date'}
          </button>
        </Popover.Target>
        <Popover.Dropdown>
          <DatePicker
            defaultValue={initialValue}
            {...(options.max ? { maxDate: options.max } : {})}
            {...(options.min ? { minDate: options.min } : {})}
            onChange={nextValue => {
              lifecycle.markCommitted();
              void commit([{ key: column.key, value: nextValue ?? '' }]);
            }}
          />
        </Popover.Dropdown>
      </Popover>
    );
  }
  Editor.displayName = `MantineDatePickerEditor(${options.id})`;
  return defineMantineEditorPlugin<T>({ id: options.id, component: Editor });
}
