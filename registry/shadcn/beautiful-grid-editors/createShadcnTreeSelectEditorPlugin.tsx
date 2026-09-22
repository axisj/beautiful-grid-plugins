import * as React from 'react';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { Check, ChevronDown, Folder, Search } from 'lucide-react';
import { EditorPopover, EditorPopoverContent, EditorPopoverTrigger } from './editor-popover';
import { defineEditorPlugin, EditorTrigger, type BaseOptions, useEditorLifecycle } from './shared';

export interface ShadcnTreeSelectNode {
  value?: string;
  title: React.ReactNode;
  searchText?: string;
  disabled?: boolean;
  children?: ShadcnTreeSelectNode[];
}

export interface ShadcnTreeSelectEditorPluginOptions extends BaseOptions {
  treeData: ShadcnTreeSelectNode[];
}

function filterTree(nodes: ShadcnTreeSelectNode[], query: string): ShadcnTreeSelectNode[] {
  if (!query) return nodes;
  const normalizedQuery = query.toLowerCase();
  return nodes.flatMap(node => {
    const children = node.children ? filterTree(node.children, query) : undefined;
    const searchable = `${node.searchText ?? ''} ${typeof node.title === 'string' ? node.title : ''} ${node.value ?? ''}`.toLowerCase();
    if (!searchable.includes(normalizedQuery) && !children?.length) return [];
    return [{ ...node, ...(children ? { children } : {}) }];
  });
}

export function createShadcnTreeSelectEditorPlugin<T>(
  options: ShadcnTreeSelectEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(cancel);
    const [query, setQuery] = React.useState('');
    const filteredTree = React.useMemo(() => filterTree(options.treeData, query), [query]);
    const renderNodes = (nodes: ShadcnTreeSelectNode[], depth = 0): React.ReactNode => nodes.map((node, index) => {
      const nodeValue = node.value ?? '';
      return (
        <React.Fragment key={nodeValue || `${depth}-${index}`}>
          <button
            type='button'
            className='bgrid-shadcn-tree-option'
            style={{ paddingInlineStart: `${8 + depth * 18}px` }}
            disabled={!nodeValue || node.disabled}
            data-selected={nodeValue === value || undefined}
            onClick={() => {
              lifecycle.commitStarted();
              void commit([{ key: column.key, value: nodeValue }]);
            }}
          >
            {node.children?.length ? <Folder /> : <span className='bgrid-shadcn-tree-spacer' />}
            <span>{node.title}</span>{nodeValue === value ? <Check /> : null}
          </button>
          {node.children?.length ? renderNodes(node.children, depth + 1) : null}
        </React.Fragment>
      );
    });
    return (
      <EditorPopover open={lifecycle.open} onOpenChange={lifecycle.onOpenChange}>
        <EditorPopoverTrigger asChild>
          <EditorTrigger ariaLabel={options.ariaLabel} cancel={cancel} icon={<ChevronDown />}>
            {typeof value === 'string' && value ? value : options.placeholder ?? 'Select item'}
          </EditorTrigger>
        </EditorPopoverTrigger>
        <EditorPopoverContent container={getPortalContainer()} className='w-72' align='start'>
          <label className='bgrid-shadcn-search'><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder='Search…' /></label>
          <div className='bgrid-shadcn-tree'>{renderNodes(filteredTree)}</div>
        </EditorPopoverContent>
      </EditorPopover>
    );
  }
  Editor.displayName = `ShadcnTreeSelectEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

