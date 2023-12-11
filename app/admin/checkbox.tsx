import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';

export default function CheckboxField({
  name,
  label,
  disabled,
  classname = 'flex items-center gap-x-2 space-y-0 py-2',
}: {
  name: string;
  label: string;
  disabled?: boolean;
  classname?: string;
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classname}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormLabel>{label}</FormLabel>
        </FormItem>
      )}
    />
  );
}
