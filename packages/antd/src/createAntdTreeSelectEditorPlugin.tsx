import * as React from 'react';
import { TreeSelect } from 'antd';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { defineEditorPlugin, handleEscape, type BaseOptions, useEditorLifecycle } from './shared';

export interface AntdTreeSelectNode {
  value: string;
  title: React.ReactNode;
  disabled?: boolean;
  children?: AntdTreeSelectNode[];
}

export interface AntdTreeSelectEditorPluginOptions extends BaseOptions {
  treeData: AntdTreeSelectNode[];
  placeholder?: string;
  treeDefaultExpandAll?: boolean;
}

export function createAntdTreeSelectEditorPlugin<T>(
  options: AntdTreeSelectEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(options.openOnMount ?? true, cancel);
    return (
      <TreeSelect<string, AntdTreeSelectNode>
        aria-label={options.ariaLabel}
        autoFocus
        className='bgrid-antd-tree-select-editor'
        classNames={{ popup: { root: 'bgrid-antd-editor-popup' } }}
        {...(typeof value === 'string' ? { defaultValue: value } : {})}
        getPopupContainer={getPortalContainer}
        open={lifecycle.open}
        {...(options.placeholder ? { placeholder: options.placeholder } : {})}
        size='small'
        treeData={options.treeData}
        treeDefaultExpandAll={options.treeDefaultExpandAll ?? true}
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
  Editor.displayName = `AntdTreeSelectEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

