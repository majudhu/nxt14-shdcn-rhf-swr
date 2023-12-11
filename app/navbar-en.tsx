'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavbarEn() {
  const { pathname } = useRouter();

  const dhivehi_path =
    pathname === '/404' ||
    pathname === '/en' ||
    pathname.startsWith('/en/pages/')
      ? '/'
      : '/' + pathname.split('/')[2];

  return (
    <nav className='container flex gap-4 items-center justify-between py-2'>
      <Link
        href='/en'
        className='flex flex-1 lg:flex-none items-center px-5 py-3 bg-pumpkin rounded-20 relative z-10'
      >
        <img src='/next.svg' className='h-9 sm:h-11' />
      </Link>

      <Button asChild>
        <Link href='/news'>News</Link>
      </Button>

      <Button asChild variant='ghost' size='sm'>
        <Link href='/admin'>Admin</Link>
      </Button>

      <Link className='flex-none p-4 text-xl' href={dhivehi_path}>
        ދިވެހި
      </Link>
    </nav>
  );
}
