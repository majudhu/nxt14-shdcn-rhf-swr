'use client';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export function ComboboxField({
  name,
  label,
  placeholder,
  required,
  disabled,
  classname,
  inputClass = '',
  options,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  classname?: string;
  inputClass?: string;
  options: { value: string; label: string }[];
}) {
  const { control } = useFormContext();

  const [newItem, setNewItem] = useState('');

  const newItemLc = newItem.toLowerCase();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classname}>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn(
                    'w-full justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                  disabled={disabled}
                >
                  {field.value
                    ? options.find((options) => options.value === field.value)
                        ?.label ?? field.value
                    : placeholder}
                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
              <Command>
                <CommandInput
                  placeholder={placeholder}
                  className={'h-9 ' + inputClass}
                  required={required}
                  disabled={disabled}
                  onValueChange={(value) => setNewItem(value)}
                />
                <CommandEmpty></CommandEmpty>
                <CommandGroup>
                  {options.map(({ label, value }) => (
                    <CommandItem
                      value={label}
                      key={value}
                      onSelect={() => field.onChange(value)}
                    >
                      {label}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          value === field.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>

                {newItem &&
                  field.value !== newItem &&
                  options.every(
                    ({ label, value }) =>
                      label.toLowerCase() !== newItemLc &&
                      value.toLowerCase() !== newItemLc
                  ) && (
                    <Button
                      variant='ghost'
                      className='w-full'
                      onClick={() => field.onChange(newItem)}
                    >
                      Add {newItem}
                    </Button>
                  )}
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
