import * as React from 'react';
import { ColorInput } from '@mantine/core';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import {
  defineMantineEditorPlugin,
  handleMantineEscape,
  type MantineEditorBaseOptions,
  useMantineEditorLifecycle,
} from './shared';

const HEX_COLOR = /^#[\dA-Fa-f]{6}$/;
const HEXA_COLOR = /^#[\dA-Fa-f]{8}$/;

export interface MantineColorPickerEditorPluginOptions extends MantineEditorBaseOptions {
  fallbackColor?: string;
  colors?: string[];
  disabledAlpha?: boolean;
}

export function createMantineColorPickerEditorPlugin<T>(
  options: MantineColorPickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const colorPattern = options.disabledAlpha === false ? new RegExp(`${HEX_COLOR.source}|${HEXA_COLOR.source}`) : HEX_COLOR;
    const fallbackColor = options.fallbackColor && colorPattern.test(options.fallbackColor)
      ? options.fallbackColor.toUpperCase()
      : '#228BE6';
    const initialColor = typeof value === 'string' && colorPattern.test(value) ? value : fallbackColor;
    const lifecycle = useMantineEditorLifecycle(options.openOnMount ?? true, cancel);
    return (
      <ColorInput
        aria-label={options.ariaLabel}
        autoFocus
        className='bgrid-mantine-color-editor'
        closeOnColorSwatchClick
        defaultValue={initialColor}
        format={options.disabledAlpha === false ? 'hexa' : 'hex'}
        popoverProps={{
          classNames: { dropdown: 'bgrid-mantine-editor-popup' },
          opened: lifecycle.open,
          portalProps: { target: getPortalContainer() },
          withinPortal: true,
          onChange: lifecycle.onOpenChange,
        }}
        {...(options.colors ? { swatches: options.colors } : {})}
        variant='unstyled'
        withEyeDropper={false}
        onChangeEnd={nextColor => {
          lifecycle.markCommitted();
          void commit([{ key: column.key, value: nextColor.toUpperCase() }]);
        }}
        onKeyDown={event => handleMantineEscape(event, cancel)}
      />
    );
  }
  Editor.displayName = `MantineColorPickerEditor(${options.id})`;
  return defineMantineEditorPlugin<T>({ id: options.id, component: Editor });
}
