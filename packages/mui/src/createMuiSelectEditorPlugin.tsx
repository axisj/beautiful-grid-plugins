import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import {
  defineMuiEditorPlugin,
  handleMuiEscape,
  type MuiEditorBaseOptions,
  useMuiEditorLifecycle,
} from './shared';

export interface MuiSelectEditorOption<Value extends string | number> {
  value: Value;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface MuiSelectEditorPluginOptions<Value extends string | number>
  extends MuiEditorBaseOptions {
  options: MuiSelectEditorOption<Value>[];
  placeholder?: React.ReactNode;
}

export function createMuiSelectEditorPlugin<T, Value extends string | number = string>(
  options: MuiSelectEditorPluginOptions<Value>,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useMuiEditorLifecycle(options.openOnMount ?? true, cancel);
    return (
      <Select<Value>
        autoFocus
        className='bgrid-mui-select-editor'
        defaultValue={value as Value}
        displayEmpty={options.placeholder !== undefined}
        fullWidth
        inputProps={{ 'aria-label': options.ariaLabel }}
        MenuProps={{
          container: getPortalContainer,
          classes: { paper: 'bgrid-mui-editor-popup' },
        }}
        open={lifecycle.open}
        renderValue={selected => {
          const match = options.options.find(option => option.value === selected);
          return match?.label ?? options.placeholder ?? String(selected ?? '');
        }}
        size='small'
        variant='standard'
        onChange={event => {
          lifecycle.markCommitted();
          void commit([{ key: column.key, value: event.target.value as Value }]);
        }}
        onClose={() => lifecycle.onOpenChange(false)}
        onOpen={() => lifecycle.onOpenChange(true)}
        onKeyDown={event => handleMuiEscape(event, cancel)}
      >
        {options.options.map(option => (
          <MenuItem key={String(option.value)} value={option.value} disabled={option.disabled}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    );
  }
  Editor.displayName = `MuiSelectEditor(${options.id})`;
  return defineMuiEditorPlugin<T>({ id: options.id, component: Editor });
}
