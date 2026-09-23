import * as React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import {
  defineMuiEditorPlugin,
  handleMuiEscape,
  type MuiEditorBaseOptions,
  useMuiEditorLifecycle,
} from './shared';

const HEX_COLOR = /^#[\dA-Fa-f]{6}$/;

export interface MuiColorPickerEditorPluginOptions extends MuiEditorBaseOptions {
  fallbackColor?: string;
  colors?: string[];
}

export function createMuiColorPickerEditorPlugin<T>(
  options: MuiColorPickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const fallbackColor = options.fallbackColor && HEX_COLOR.test(options.fallbackColor)
      ? options.fallbackColor.toUpperCase()
      : '#1976D2';
    const initialColor = typeof value === 'string' && HEX_COLOR.test(value)
      ? value.toUpperCase()
      : fallbackColor;
    const [color, setColor] = React.useState(initialColor);
    const [anchorElement, setAnchorElement] = React.useState<HTMLButtonElement | null>(null);
    const lifecycle = useMuiEditorLifecycle(options.openOnMount ?? true, cancel);
    const save = () => {
      if (!HEX_COLOR.test(color)) return;
      lifecycle.markCommitted();
      void commit([{ key: column.key, value: color.toUpperCase() }]);
    };

    return (
      <>
        <button
          ref={setAnchorElement}
          type='button'
          autoFocus
          className='bgrid-mui-color-editor'
          aria-label={options.ariaLabel}
          onKeyDown={event => handleMuiEscape(event, cancel)}
        >
          <span className='bgrid-mui-color-value'>{color.toUpperCase()}</span>
          <span className='bgrid-mui-color-swatch' style={{ backgroundColor: color }} aria-hidden='true' />
        </button>
        <Popover
          anchorEl={anchorElement}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          className='bgrid-mui-editor-popup'
          container={getPortalContainer}
          open={lifecycle.open && Boolean(anchorElement)}
          onClose={() => lifecycle.onOpenChange(false)}
        >
          <div className='bgrid-mui-color-popup'>
            <input
              type='color'
              aria-label={`${options.ariaLabel} palette`}
              value={HEX_COLOR.test(color) ? color : initialColor}
              onChange={event => setColor(event.target.value.toUpperCase())}
            />
            {options.colors?.length ? (
              <div className='bgrid-mui-color-presets'>
                {options.colors.filter(candidate => HEX_COLOR.test(candidate)).map(candidate => (
                  <button
                    key={candidate}
                    type='button'
                    aria-label={`Color ${candidate}`}
                    style={{ backgroundColor: candidate }}
                    onClick={() => setColor(candidate.toUpperCase())}
                  />
                ))}
              </div>
            ) : null}
            <TextField
              label='HEX'
              size='small'
              value={color}
              onChange={event => setColor(event.target.value)}
            />
            <Button disabled={!HEX_COLOR.test(color)} variant='contained' onClick={save}>Apply</Button>
          </div>
        </Popover>
      </>
    );
  }
  Editor.displayName = `MuiColorPickerEditor(${options.id})`;
  return defineMuiEditorPlugin<T>({ id: options.id, component: Editor });
}
