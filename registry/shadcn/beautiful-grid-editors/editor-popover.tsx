import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

function classes(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ');
}

export const EditorPopover = PopoverPrimitive.Root;
export const EditorPopoverTrigger = PopoverPrimitive.Trigger;

export interface EditorPopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  container?: HTMLElement | null;
}

export const EditorPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  EditorPopoverContentProps
>(({ className, container, sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal container={container}>
    <PopoverPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={classes(
        'bgrid-shadcn-popover z-50 rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-none',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

EditorPopoverContent.displayName = 'EditorPopoverContent';
