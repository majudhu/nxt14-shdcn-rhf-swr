import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Pagination({
  total,
  className = '',
}: {
  total?: number;
  className?: string;
}) {
  const { query } = useRouter();

  if (!total || total === 1) return null;

  return (
    <div
      className={'flex flex-wrap gap-2 py-6 text-white text-sm ' + className}
    >
      {Array.from({ length: total }).map((_, i) => (
        <Link
          key={i}
          className={`min-w-[24px] px-1 text-center pt-1 rounded-full border border-pumpkin ${
            +query.page! === i + 1 ? 'bg-pumpkin' : 'bg-olivine'
          }`}
          href={{ query: { ...query, page: i + 1 } }}
        >
          {i + 1}
        </Link>
      ))}
    </div>
  );
}
