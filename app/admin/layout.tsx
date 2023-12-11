'use client';

import { axiosClient } from '@/lib/axios';
import '@/app/globals.css';
import { useSelectedLayoutSegments } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { SWRConfig, type SWRConfiguration } from 'swr';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layoutSegments = useSelectedLayoutSegments();

  const pageTitle =
    layoutSegments[0] === 'login'
      ? 'Admin Login'
      : layoutSegments.length < 3
      ? 'Admin'
      : `${mapOrCap(PAGES, layoutSegments[2])} - ${mapOrCap(
          GROUPS,
          layoutSegments[1]
        )} - Admin`;

  return (
    <SWRConfig value={SWR_CONFIG}>
      <html lang='en'>
        <head>
          <title>{pageTitle}</title>
        </head>
        <body className='min-h-screen flex flex-col md:flex-row bg-sunglow'>
          <Toaster position='top-center' toastOptions={TOAST_OPTIONS} />
          {children}
        </body>
      </html>
    </SWRConfig>
  );
}

const TOAST_OPTIONS = { duration: 5000 };

const SWR_CONFIG: SWRConfiguration = {
  fetcher: (url: string) =>
    axiosClient.defaults.headers.Authorization
      ? axiosClient.get(url).then((res) => res.data)
      : undefined,
  onError: (err) =>
    location.pathname !== '/admin/login' &&
    toast.error(err.response?.data?.message ?? err.message),
};

function mapOrCap(map: Record<string, string>, key: string) {
  return map[key] ?? key[0].toUpperCase() + key.slice(1);
}

const GROUPS: Record<string, string> = {
  media: 'Media Center',
};

const PAGES: Record<string, string> = {
  vision: 'Vision & Mission',
  'action-plan': 'Action Plan',
  galleries: 'Photo Gallery',
};
