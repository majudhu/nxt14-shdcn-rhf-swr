import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  className: string;
  links: { title: string; href: string }[];
}

export default function SideNavMenu({ className, links }: Props) {
  const { asPath } = useRouter();

  return (
    <aside
      className={
        'rounded-20 bg-white overflow-hidden text-pumpkin ' + className
      }
    >
      {links.map(({ title, href }) => (
        <div
          key={title}
          className={`flex items-center gap-3 px-5 py-4 ${
            asPath === href ? 'bg-sunglow' : ''
          }`}
        >
          <img src='/icons/files.svg' className='w-10 h-10' alt='' />
          <Link href={href} className='flex-1 text-lg'>
            {title}
          </Link>
        </div>
      ))}
    </aside>
  );
}
