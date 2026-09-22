import * as React from 'react';
import type { BGridPluginEditorConfig } from 'beautiful-grid';

export interface BaseOptions {
  id: string;
  ariaLabel: string;
  placeholder?: string;
}

export function defineEditorPlugin<T>(
  config: Omit<BGridPluginEditorConfig<T>, 'type'>,
): BGridPluginEditorConfig<T> {
  return { ...config, type: 'plugin' };
}

export function useEditorLifecycle(cancel: () => void) {
  const [open, setOpen] = React.useState(true);
  const committedRef = React.useRef(false);
  return {
    open,
    commitStarted: () => {
      committedRef.current = true;
    },
    onOpenChange: (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen && !committedRef.current) cancel();
    },
  };
}

export function EditorTrigger({
  ariaLabel,
  children,
  icon,
  cancel,
}: {
  ariaLabel: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  cancel: () => void;
}) {
  return (
    <button
      type='button'
      className='bgrid-shadcn-trigger'
      aria-label={ariaLabel}
      autoFocus
      onKeyDown={event => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.preventDefault();
          event.stopPropagation();
          cancel();
        }
      }}
    >
      <span className='bgrid-shadcn-trigger-label'>{children}</span>
      {icon ? <span className='bgrid-shadcn-trigger-icon'>{icon}</span> : null}
    </button>
  );
}
