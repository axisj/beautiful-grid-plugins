import * as React from 'react';
import type { BGridPluginEditorConfig } from 'beautiful-grid';

export interface MantineEditorBaseOptions {
  id: string;
  ariaLabel: string;
  openOnMount?: boolean;
}

export function defineMantineEditorPlugin<T>(
  config: Omit<BGridPluginEditorConfig<T>, 'type'>,
): BGridPluginEditorConfig<T> {
  return { ...config, type: 'plugin' };
}

export function useMantineEditorLifecycle(initiallyOpen: boolean, cancel: () => void) {
  const [open, setOpen] = React.useState(initiallyOpen);
  const committedRef = React.useRef(false);

  return {
    open,
    markCommitted: () => {
      committedRef.current = true;
    },
    onOpenChange: (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen && !committedRef.current) cancel();
    },
  };
}

export function handleMantineEscape(event: React.KeyboardEvent, cancel: () => void) {
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.preventDefault();
    event.stopPropagation();
    cancel();
  }
}
