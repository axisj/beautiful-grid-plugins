import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import {
  defineMuiEditorPlugin,
  type MuiEditorBaseOptions,
  useMuiEditorLifecycle,
} from './shared';

dayjs.extend(customParseFormat);

export interface MuiDatePickerEditorPluginOptions extends MuiEditorBaseOptions {
  format?: string;
  min?: string;
  max?: string;
  placeholder?: string;
}

export function createMuiDatePickerEditorPlugin<T>(
  options: MuiDatePickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  const format = options.format ?? 'YYYY-MM-DD';
  const minDate = options.min ? dayjs(options.min, format, true) : undefined;
  const maxDate = options.max ? dayjs(options.max, format, true) : undefined;

  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useMuiEditorLifecycle(options.openOnMount ?? true, cancel);
    const initialValue = typeof value === 'string' && value ? dayjs(value, format, true) : null;
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          closeOnSelect
          defaultValue={initialValue?.isValid() ? initialValue : null}
          format={format}
          {...(maxDate?.isValid() ? { maxDate } : {})}
          {...(minDate?.isValid() ? { minDate } : {})}
          open={lifecycle.open}
          {...(options.placeholder ? { label: options.placeholder } : {})}
          slotProps={{
            popper: { container: getPortalContainer, className: 'bgrid-mui-editor-popup' },
            textField: {
              autoFocus: true,
              className: 'bgrid-mui-date-editor',
              fullWidth: true,
              size: 'small',
              slotProps: { htmlInput: { 'aria-label': options.ariaLabel } },
              variant: 'standard',
            },
          }}
          onAccept={nextValue => {
            lifecycle.markCommitted();
            void commit([{ key: column.key, value: nextValue?.isValid() ? nextValue.format(format) : '' }]);
          }}
          onClose={() => lifecycle.onOpenChange(false)}
        />
      </LocalizationProvider>
    );
  }
  Editor.displayName = `MuiDatePickerEditor(${options.id})`;
  return defineMuiEditorPlugin<T>({ id: options.id, component: Editor });
}
