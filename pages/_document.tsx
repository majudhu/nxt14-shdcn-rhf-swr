import { Html, Head, Main, NextScript } from 'next/document';
import type { NEXT_DATA } from 'next/dist/shared/lib/utils';

type Props = { __NEXT_DATA__: NEXT_DATA };

export default function Document({ __NEXT_DATA__ }: Props) {
  const en = __NEXT_DATA__?.page?.startsWith('/en');

  return (
    <Html lang={en ? 'en' : 'dv'} dir={en ? 'ltr' : 'rtl'}>
      <Head />
      <body
        className={`text-charcoal bg-[#faf8fb] antialiased ${
          en ? '' : 'font-waheed'
        }`}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
