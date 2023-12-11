'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/dv';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';

dayjs.locale('dv');
dayjs.extend(utc);
dayjs.extend(timezone);

export default function FormattedLocalTime({
  format,
  en,
  ...props
}: React.HTMLProps<HTMLTimeElement> & { en?: boolean; format: string }) {
  const parsed = dayjs(props.dateTime).locale(en ? 'en' : 'dv');

  const [formatted, setFormatted] = useState(
    parsed.tz('Indian/Maldives').format(format)
  );

  useEffect(() => {
    setFormatted(parsed.format(format)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dateTime, en, format]);

  return <time {...props}>{formatted}</time>;
}
