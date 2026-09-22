import * as React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { defineEditorPlugin, handleEscape, type BaseOptions, useEditorLifecycle } from './shared';

dayjs.extend(customParseFormat);

export interface AntdDatePickerEditorPluginOptions extends BaseOptions {
  format?: string;
  min?: string;
  max?: string;
  placeholder?: string;
}

export function createAntdDatePickerEditorPlugin<T>(
  options: AntdDatePickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  const format = options.format ?? 'YYYY-MM-DD';
  const minDate = options.min ? dayjs(options.min, format) : undefined;
  const maxDate = options.max ? dayjs(options.max, format) : undefined;

  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(options.openOnMount ?? true, cancel);
    const initialValue = typeof value === 'string' && value ? dayjs(value, format) : null;
    return (
      <DatePicker
        aria-label={options.ariaLabel}
        autoFocus
        className='bgrid-antd-date-editor'
        classNames={{ popup: { root: 'bgrid-antd-editor-popup' } }}
        defaultValue={initialValue}
        format={format}
        getPopupContainer={getPortalContainer}
        {...(maxDate ? { maxDate } : {})}
        {...(minDate ? { minDate } : {})}
        open={lifecycle.open}
        {...(options.placeholder ? { placeholder: options.placeholder } : {})}
        size='small'
        variant='borderless'
        onChange={nextValue => {
          lifecycle.markCommitted();
          void commit([{ key: column.key, value: nextValue ? nextValue.format(format) : '' }]);
        }}
        onOpenChange={lifecycle.onOpenChange}
        onKeyDown={event => handleEscape(event, cancel)}
      />
    );
  }
  Editor.displayName = `AntdDatePickerEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

