import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export default function TextArea({
  name,
  label,
  placeholder,
  required,
  disabled,
  classname,
  inputClass,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  classname?: string;
  inputClass?: string;
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
            <Textarea
              disabled={disabled}
              className={inputClass}
              required={required}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
