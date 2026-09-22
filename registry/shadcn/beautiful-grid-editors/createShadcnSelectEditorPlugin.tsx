import * as React from 'react';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { Check, ChevronDown } from 'lucide-react';
import { EditorPopover, EditorPopoverContent, EditorPopoverTrigger } from './editor-popover';
import { defineEditorPlugin, EditorTrigger, type BaseOptions, useEditorLifecycle } from './shared';

export interface ShadcnSelectEditorOption<Value extends string | number> {
  value: Value;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface ShadcnSelectEditorPluginOptions<Value extends string | number> extends BaseOptions {
  options: ShadcnSelectEditorOption<Value>[];
}

export function createShadcnSelectEditorPlugin<T, Value extends string | number = string>(
  options: ShadcnSelectEditorPluginOptions<Value>,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(cancel);
    const selected = options.options.find(option => option.value === value);
    return (
      <EditorPopover open={lifecycle.open} onOpenChange={lifecycle.onOpenChange}>
        <EditorPopoverTrigger asChild>
          <EditorTrigger ariaLabel={options.ariaLabel} cancel={cancel} icon={<ChevronDown />}>
            {selected?.label ?? options.placeholder ?? String(value ?? '')}
          </EditorTrigger>
        </EditorPopoverTrigger>
        <EditorPopoverContent container={getPortalContainer()} className='w-64 p-1' align='start'>
          <div role='listbox' aria-label={options.ariaLabel} className='bgrid-shadcn-list'>
            {options.options.map(option => (
              <button
                key={String(option.value)}
                type='button'
                role='option'
                aria-selected={option.value === value}
                disabled={option.disabled}
                className='bgrid-shadcn-option'
                onClick={() => {
                  lifecycle.commitStarted();
                  void commit([{ key: column.key, value: option.value }]);
                }}
              >
                <span>{option.label}</span>
                {option.value === value ? <Check aria-hidden='true' /> : null}
              </button>
            ))}
          </div>
        </EditorPopoverContent>
      </EditorPopover>
    );
  }
  Editor.displayName = `ShadcnSelectEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

