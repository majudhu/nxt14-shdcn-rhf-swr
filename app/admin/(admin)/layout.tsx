'use client';

import { Button } from '@/components/ui/button';
import type { LoginPostResponse } from '@/lib/api-types';
import { axiosClient } from '@/lib/axios';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();
  const [group, page] = useSelectedLayoutSegments();

  const [expanded, setExpanded] = useState('');

  const { data, error, isValidating } =
    useSWR<LoginPostResponse['user']>('auth/me');

  useEffect(() => {
    if (isValidating || (data?.role && !error)) return;

    const accessToken = localStorage.getItem('accessToken');

    if (error || !accessToken) {
      push('/admin/login');
    } else if (accessToken && !data?.role) {
      axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
      mutate(() => true);
    }
  }, [data?.role, error, isValidating, push]);

  function logout() {
    axiosClient.post('auth/logout');
    localStorage.removeItem('accessToken');
    delete axiosClient.defaults.headers.Authorization;
    mutate(() => true, undefined, { revalidate: false });
    push('/admin/login');
  }

  useEffect(() => {
    if (group) setExpanded(group);
  }, [group]);

  return data?.role === 'admin' ? (
    <>
      <aside className='flex-none w-full md:w-64 overflow-y-auto flex flex-col gap-3 p-5 bg-white max-h-screen'>
        <Link
          href='/admin'
          className='bg-pumpkin p-4 rounded-10'
          onClick={() => setExpanded('')}
        >
          <img src='/next.svg' className='h-10' alt='Next.js' />
        </Link>

        <nav className='flex-1 overflow-y-auto'>
          {MENU.map(({ title, href, items }) => (
            <Fragment key={href}>
              <button
                className='mt-3 pl-4 pr-2 py-2 bg-sunglow rounded-10 w-full text-left text-pumpkin font-semibold'
                onClick={() => setExpanded(expanded === href ? '' : href)}
              >
                {title}
                <ChevronLeftIcon
                  className={
                    'w-5 float-right mt-1 text-olivine ' +
                    (expanded === href ? 'rotate-90' : '-rotate-90')
                  }
                />
              </button>
              {expanded === href && (
                <div className='bg-white rounded-20 py-2 text-olivine'>
                  {items.map(({ href: ihref, title }) => (
                    <Link
                      key={ihref}
                      href={`/admin/${href}/${ihref}`}
                      className={
                        'p-2 flex items-center gap-2 rounded-10 ' +
                        (page === ihref
                          ? 'text-charcoal bg-olivine/50'
                          : 'hover:bg-sunglow')
                      }
                    >
                      {title}
                      <ChevronLeftIcon className='ml-auto w-5 rotate-180' />
                    </Link>
                  ))}
                </div>
              )}
            </Fragment>
          ))}
        </nav>
        <Button variant='ghost' asChild>
          <Link href='/'>Back to website</Link>
        </Button>
        <p className='text-center text-sm text-charcoal pt-8'>
          Welcome, {data?.name}
        </p>
        <Button
          variant='destructive'
          className='mx-auto flex-none'
          size='sm'
          onClick={logout}
        >
          Logout
        </Button>
      </aside>
      <main className='flex-1'>{children}</main>
    </>
  ) : (
    <div className='flex items-center justify-center w-full flex-1 bg-pumpkin'>
      <img src='/next.svg' className='h-11' alt='Next.js' />
    </div>
  );
}

const MENU: {
  title: string;
  href: string;
  items: { title: string; href: string }[];
}[] = [
  {
    title: 'Organization',
    href: '#organization',
    items: [
      {
        title: 'Vision & Mission',
        href: '#vision',
      },
      {
        title: 'Management',
        href: '#management',
      },
      {
        title: 'Structure',
        href: '#structure',
      },
      {
        title: 'Action Plan',
        href: '#action-plan',
      },
    ],
  },
  {
    title: 'Publications',
    href: '#publications',
    items: [
      {
        title: 'Announcements',
        href: '#announcements',
      },
      {
        title: 'Procurement',
        href: '#procurement',
      },
      {
        title: 'Downloads',
        href: '#downloads',
      },
      {
        title: 'Jobs',
        href: '#jobs',
      },
    ],
  },
  {
    title: 'Media Center',
    href: 'media',
    items: [
      {
        title: 'News',
        href: 'news',
      },
      {
        title: 'Photo Gallery',
        href: '../#galleries',
      },
    ],
  },
  {
    title: 'Misc',
    href: 'misc',
    items: [
      {
        title: 'Files',
        href: 'files',
      },
      {
        title: 'Users',
        href: 'users',
      },
    ],
  },
];
