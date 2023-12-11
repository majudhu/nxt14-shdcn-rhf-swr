import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';

export default function SelectField({
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

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classname}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              disabled={disabled}
              required={required}
              onValueChange={field.onChange}
              {...field}
            >
              <SelectTrigger
                className={`text-sm ${inputClass} ${
                  field.value === '-' ? 'text-gray-400 italic font-light' : ''
                }`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {!required && (
                    <SelectItem
                      value='-'
                      className='text-sm italic font-light text-gray-400'
                    >
                      None
                    </SelectItem>
                  )}
                  {options.map(({ label, value }) => (
                    <SelectItem key={value} value={value} className='text-sm'>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
