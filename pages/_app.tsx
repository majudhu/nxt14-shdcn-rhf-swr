import FooterDv from '@/app/footer-dv';
import FooterEn from '@/app/footer-en';
import NavbarDv from '@/app/navbar-dv';
import NavbarEn from '@/app/navbar-en';
import '@/app/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SWRConfig, type SWRConfiguration } from 'swr';

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const isEn = pathname.startsWith('/en');

  if (typeof document !== 'undefined') {
    if (isEn) {
      document.documentElement.lang = 'en';
      document.dir = 'ltr';
      document.body.classList.remove('font-waheed');
    } else {
      document.documentElement.lang = 'dv';
      document.dir = 'rtl';
      document.body.classList.add('font-waheed');
    }
  }

  return (
    <SWRConfig value={SWR_CONFIG}>
      {isEn ? <NavbarEn /> : <NavbarDv />}
      <Component {...pageProps} />
      {isEn ? <FooterEn /> : <FooterDv />}
    </SWRConfig>
  );
}

const SWR_CONFIG: SWRConfiguration = {
  fetcher: (url: string) =>
    fetch(process.env.NEXT_PUBLIC_API_URL! + url).then((res) => res.json()),
};
