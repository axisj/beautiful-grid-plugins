import * as React from 'react';
import { Select } from 'antd';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { defineEditorPlugin, handleEscape, type BaseOptions, useEditorLifecycle } from './shared';

export interface AntdSelectEditorOption<Value extends string | number> {
  value: Value;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface AntdSelectEditorPluginOptions<Value extends string | number> extends BaseOptions {
  options: AntdSelectEditorOption<Value>[];
  placeholder?: string;
}

export function createAntdSelectEditorPlugin<T, Value extends string | number = string>(
  options: AntdSelectEditorPluginOptions<Value>,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(options.openOnMount ?? true, cancel);
    return (
      <Select<Value>
        aria-label={options.ariaLabel}
        autoFocus
        className='bgrid-antd-select-editor'
        classNames={{ popup: { root: 'bgrid-antd-editor-popup' } }}
        defaultValue={value as Value}
        getPopupContainer={getPortalContainer}
        open={lifecycle.open}
        options={options.options}
        {...(options.placeholder ? { placeholder: options.placeholder } : {})}
        size='small'
        variant='borderless'
        onChange={nextValue => {
          lifecycle.markCommitted();
          void commit([{ key: column.key, value: nextValue }]);
        }}
        onOpenChange={lifecycle.onOpenChange}
        onKeyDown={event => handleEscape(event, cancel)}
      />
    );
  }
  Editor.displayName = `AntdSelectEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

