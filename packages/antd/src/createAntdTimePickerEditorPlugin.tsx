import * as React from 'react';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { defineEditorPlugin, handleEscape, type BaseOptions, useEditorLifecycle } from './shared';

dayjs.extend(customParseFormat);

export interface AntdTimePickerEditorPluginOptions extends BaseOptions {
  format?: string;
  placeholder?: string;
  minuteStep?: 1 | 5 | 10 | 15 | 30;
}

export function createAntdTimePickerEditorPlugin<T>(
  options: AntdTimePickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  const format = options.format ?? 'HH:mm';
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(options.openOnMount ?? true, cancel);
    const initialValue = typeof value === 'string' && value ? dayjs(value, format) : null;
    return (
      <TimePicker
        aria-label={options.ariaLabel}
        autoFocus
        className='bgrid-antd-time-editor'
        classNames={{ popup: { root: 'bgrid-antd-editor-popup' } }}
        defaultValue={initialValue}
        format={format}
        getPopupContainer={getPortalContainer}
        {...(options.minuteStep ? { minuteStep: options.minuteStep } : {})}
        needConfirm
        open={lifecycle.open}
        {...(options.placeholder ? { placeholder: options.placeholder } : {})}
        size='small'
        variant='borderless'
        onOk={nextValue => {
          lifecycle.markCommitted();
          void commit([{ key: column.key, value: nextValue ? nextValue.format(format) : '' }]);
        }}
        onOpenChange={lifecycle.onOpenChange}
        onKeyDown={event => handleEscape(event, cancel)}
      />
    );
  }
  Editor.displayName = `AntdTimePickerEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

