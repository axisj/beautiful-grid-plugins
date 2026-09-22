import * as React from 'react';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { EditorPopover, EditorPopoverContent, EditorPopoverTrigger } from './editor-popover';
import { defineEditorPlugin, EditorTrigger, type BaseOptions, useEditorLifecycle } from './shared';

export interface ShadcnCascaderOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  children?: ShadcnCascaderOption[];
}

export interface ShadcnCascaderEditorPluginOptions extends BaseOptions {
  options: ShadcnCascaderOption[];
}

export function createShadcnCascaderEditorPlugin<T>(
  options: ShadcnCascaderEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(cancel);
    const initialPath = Array.isArray(value) ? value.map(String) : [];
    const [path, setPath] = React.useState(initialPath);
    const levels = React.useMemo(() => {
      const result: ShadcnCascaderOption[][] = [options.options];
      let current = options.options;
      for (const segment of path) {
        const match = current.find(option => option.value === segment);
        if (!match?.children?.length) break;
        result.push(match.children);
        current = match.children;
      }
      return result;
    }, [path]);
    return (
      <EditorPopover open={lifecycle.open} onOpenChange={lifecycle.onOpenChange}>
        <EditorPopoverTrigger asChild>
          <EditorTrigger ariaLabel={options.ariaLabel} cancel={cancel} icon={<ChevronDown />}>
            {initialPath.length ? initialPath.join(' / ') : options.placeholder ?? 'Select category'}
          </EditorTrigger>
        </EditorPopoverTrigger>
        <EditorPopoverContent container={getPortalContainer()} className='w-auto p-1' align='start'>
          <div className='bgrid-shadcn-cascader'>
            {levels.map((level, levelIndex) => (
              <div key={levelIndex} className='bgrid-shadcn-list'>
                {level.map(option => (
                  <button
                    key={option.value}
                    type='button'
                    disabled={option.disabled}
                    className='bgrid-shadcn-option'
                    data-selected={path[levelIndex] === option.value || undefined}
                    onClick={() => {
                      const nextPath = [...path.slice(0, levelIndex), option.value];
                      setPath(nextPath);
                      if (!option.children?.length) {
                        lifecycle.commitStarted();
                        void commit([{ key: column.key, value: nextPath }]);
                      }
                    }}
                  >
                    <span>{option.label}</span>{option.children?.length ? <ChevronRight /> : null}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </EditorPopoverContent>
      </EditorPopover>
    );
  }
  Editor.displayName = `ShadcnCascaderEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

