import * as React from 'react';
import type { BGridEditorPluginProps, BGridPluginEditorConfig } from 'beautiful-grid';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditorPopover, EditorPopoverContent, EditorPopoverTrigger } from './editor-popover';
import { defineEditorPlugin, EditorTrigger, type BaseOptions, useEditorLifecycle } from './shared';

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDate(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year!, month! - 1, day);
  return formatDate(date) === value ? date : undefined;
}

export interface ShadcnDatePickerEditorPluginOptions extends BaseOptions {
  min?: string;
  max?: string;
  weekStartsOn?: 0 | 1;
}

export function createShadcnDatePickerEditorPlugin<T>(
  options: ShadcnDatePickerEditorPluginOptions,
): BGridPluginEditorConfig<T> {
  function Editor({ value, column, commit, cancel, getPortalContainer }: BGridEditorPluginProps<T>) {
    const lifecycle = useEditorLifecycle(cancel);
    const selectedDate = parseDate(value);
    const [month, setMonth] = React.useState(() => {
      const initial = selectedDate ?? new Date();
      return new Date(initial.getFullYear(), initial.getMonth(), 1);
    });
    const days = React.useMemo(() => {
      const result: Date[] = [];
      const first = new Date(month.getFullYear(), month.getMonth(), 1);
      const offset = (first.getDay() - (options.weekStartsOn ?? 0) + 7) % 7;
      const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset);
      for (let index = 0; index < 42; index += 1) {
        result.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
      }
      return result;
    }, [month]);
    const weekdayLabels = options.weekStartsOn === 1
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <EditorPopover open={lifecycle.open} onOpenChange={lifecycle.onOpenChange}>
        <EditorPopoverTrigger asChild>
          <EditorTrigger ariaLabel={options.ariaLabel} cancel={cancel} icon={<CalendarDays />}>
            {typeof value === 'string' && value ? value : options.placeholder ?? 'Select date'}
          </EditorTrigger>
        </EditorPopoverTrigger>
        <EditorPopoverContent container={getPortalContainer()} className='w-auto' align='start'>
          <div className='bgrid-shadcn-calendar-header'>
            <strong>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong>
            <div>
              <button type='button' aria-label='Previous month' onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft /></button>
              <button type='button' aria-label='Next month' onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight /></button>
            </div>
          </div>
          <div className='bgrid-shadcn-calendar-grid bgrid-shadcn-weekdays'>
            {weekdayLabels.map(label => <span key={label}>{label}</span>)}
          </div>
          <div className='bgrid-shadcn-calendar-grid'>
            {days.map(date => {
              const dateValue = formatDate(date);
              const disabled = Boolean((options.min && dateValue < options.min) || (options.max && dateValue > options.max));
              return (
                <button
                  key={dateValue}
                  type='button'
                  disabled={disabled}
                  data-outside={date.getMonth() !== month.getMonth() || undefined}
                  data-selected={dateValue === value || undefined}
                  onClick={() => {
                    lifecycle.commitStarted();
                    void commit([{ key: column.key, value: dateValue }]);
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </EditorPopoverContent>
      </EditorPopover>
    );
  }
  Editor.displayName = `ShadcnDatePickerEditor(${options.id})`;
  return defineEditorPlugin<T>({ id: options.id, component: Editor });
}

