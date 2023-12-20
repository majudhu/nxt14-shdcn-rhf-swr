'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavbarDv() {
  const { pathname } = useRouter();
  const english_path =
    pathname === '/404'
      ? '/'
      : pathname.startsWith('/pages/')
      ? '/en'
      : '/en/' + pathname.split('/')[1];

  return (
    <nav className='container flex gap-4 items-center justify-between py-2'>
      <Link
        href='/'
        className='flex flex-1 lg:flex-none items-center px-5 py-3 bg-pumpkin rounded-20 relative z-10'
      >
        <img src='/next.svg' className='h-9 sm:h-11' alt='Next.js' />
      </Link>

      <Button asChild>
        <Link href='/news'>News</Link>
      </Button>

      <a
        className='text-sm'
        href='https://github.com/majudhu/nxt14-shdcn-rhf-swr'
      >
        GitHub
      </a>

      <Button asChild variant='ghost' size='sm'>
        <Link href='/admin'>Admin</Link>
      </Button>

      <Link className='flex-none p-4 text-xl' href={english_path}>
        En
      </Link>
    </nav>
  );
}
