import * as React from 'react';
import { ColorPicker } from 'antd';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { defineEditorPlugin, handleEscape, type BaseOptions, useEditorLifecycle } from './shared';

export interface AntdColorPickerEditorPluginOptions extends BaseOptions {
  fallbackColor?: string;
  disabledAlpha?: boolean;
}

export function createAntdColorPickerEditorPlugin<T>(
  options: AntdColorPickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const initialColor = typeof value === 'string' && value ? value : options.fallbackColor ?? '#1677FF';
    const [color, setColor] = React.useState(initialColor);
    const lifecycle = useEditorLifecycle(options.openOnMount ?? true, cancel);
    return (
      <ColorPicker
        aria-label={options.ariaLabel}
        defaultValue={initialColor}
        disabledAlpha={options.disabledAlpha ?? true}
        format='hex'
        getPopupContainer={getPortalContainer}
        open={lifecycle.open}
        rootClassName='bgrid-antd-editor-popup'
        onChange={(nextColor, cssColor) => setColor(cssColor || nextColor.toHexString())}
        onChangeComplete={nextColor => {
          lifecycle.markCommitted();
          void commit([{ key: column.key, value: nextColor.toHexString().toUpperCase() }]);
        }}
        onOpenChange={lifecycle.onOpenChange}
      >
        <button
          type='button'
          autoFocus
          className='bgrid-antd-color-editor'
          aria-label={options.ariaLabel}
          onKeyDown={event => handleEscape(event, cancel)}
        >
          <span className='bgrid-antd-color-value'>{color.toUpperCase()}</span>
          <span className='bgrid-antd-color-swatch' style={{ backgroundColor: color }} aria-hidden='true' />
        </button>
      </ColorPicker>
    );
  }
  Editor.displayName = `AntdColorPickerEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

