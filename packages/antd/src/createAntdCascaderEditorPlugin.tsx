import * as React from 'react';
import { Cascader } from 'antd';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { defineEditorPlugin, handleEscape, type BaseOptions, useEditorLifecycle } from './shared';

export interface AntdCascaderOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  children?: AntdCascaderOption[];
}

export interface AntdCascaderEditorPluginOptions extends BaseOptions {
  options: AntdCascaderOption[];
  placeholder?: string;
}

export function createAntdCascaderEditorPlugin<T>(
  options: AntdCascaderEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(options.openOnMount ?? true, cancel);
    const initialValue = Array.isArray(value) ? value.map(String) : [];
    return (
      <Cascader<AntdCascaderOption>
        aria-label={options.ariaLabel}
        autoFocus
        className='bgrid-antd-cascader-editor'
        classNames={{ popup: { root: 'bgrid-antd-editor-popup' } }}
        defaultValue={initialValue}
        getPopupContainer={getPortalContainer}
        open={lifecycle.open}
        options={options.options}
        {...(options.placeholder ? { placeholder: options.placeholder } : {})}
        size='small'
        variant='borderless'
        onChange={nextValue => {
          lifecycle.markCommitted();
          void commit([{ key: column.key, value: Array.from(nextValue, String) }]);
        }}
        onOpenChange={lifecycle.onOpenChange}
        onKeyDown={event => handleEscape(event, cancel)}
      />
    );
  }
  Editor.displayName = `AntdCascaderEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

