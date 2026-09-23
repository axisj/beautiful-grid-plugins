import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
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

export interface MuiTimePickerEditorPluginOptions extends MuiEditorBaseOptions {
  format?: string;
  placeholder?: string;
  minuteStep?: 1 | 5 | 10 | 15 | 20 | 30;
}

export function createMuiTimePickerEditorPlugin<T>(
  options: MuiTimePickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  const format = options.format ?? 'HH:mm';

  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useMuiEditorLifecycle(options.openOnMount ?? true, cancel);
    const initialValue = typeof value === 'string' && value ? dayjs(value, format, true) : null;
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopTimePicker
          ampm={format.includes('A') || format.includes('a')}
          defaultValue={initialValue?.isValid() ? initialValue : null}
          format={format}
          {...(options.minuteStep ? { minutesStep: options.minuteStep } : {})}
          open={lifecycle.open}
          {...(options.placeholder ? { label: options.placeholder } : {})}
          slotProps={{
            actionBar: { actions: ['cancel', 'accept'] },
            popper: { container: getPortalContainer, className: 'bgrid-mui-editor-popup' },
            textField: {
              autoFocus: true,
              className: 'bgrid-mui-time-editor',
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
  Editor.displayName = `MuiTimePickerEditor(${options.id})`;
  return defineMuiEditorPlugin<T>({ id: options.id, component: Editor });
}
