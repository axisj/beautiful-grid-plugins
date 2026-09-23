import * as React from 'react';
import { Select } from '@mantine/core';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import {
  defineMantineEditorPlugin,
  handleMantineEscape,
  type MantineEditorBaseOptions,
  useMantineEditorLifecycle,
} from './shared';

export interface MantineSelectEditorOption<Value extends string | number> {
  value: Value;
  label: string;
  disabled?: boolean;
}

export interface MantineSelectEditorPluginOptions<Value extends string | number>
  extends MantineEditorBaseOptions {
  options: MantineSelectEditorOption<Value>[];
  placeholder?: string;
  searchable?: boolean;
}

export function createMantineSelectEditorPlugin<T, Value extends string | number = string>(
  options: MantineSelectEditorPluginOptions<Value>,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useMantineEditorLifecycle(options.openOnMount ?? true, cancel);
    return (
      <Select<Value>
        aria-label={options.ariaLabel}
        autoFocus
        className='bgrid-mantine-select-editor'
        comboboxProps={{
          classNames: { dropdown: 'bgrid-mantine-editor-popup' },
          portalProps: { target: getPortalContainer() },
          withinPortal: true,
        }}
        data={options.options}
        defaultValue={value as Value}
        dropdownOpened={lifecycle.open}
        {...(options.placeholder ? { placeholder: options.placeholder } : {})}
        {...(options.searchable !== undefined ? { searchable: options.searchable } : {})}
        variant='unstyled'
        onChange={nextValue => {
          if (nextValue === null) return;
          lifecycle.markCommitted();
          void commit([{ key: column.key, value: nextValue }]);
        }}
        onDropdownClose={() => lifecycle.onOpenChange(false)}
        onDropdownOpen={() => lifecycle.onOpenChange(true)}
        onKeyDown={event => handleMantineEscape(event, cancel)}
      />
    );
  }
  Editor.displayName = `MantineSelectEditor(${options.id})`;
  return defineMantineEditorPlugin<T>({ id: options.id, component: Editor });
}
