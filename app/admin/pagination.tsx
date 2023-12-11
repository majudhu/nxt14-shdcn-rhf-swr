import type { PaginatedApiResponse } from '@/lib/api-types';

export default function Pagination({
  meta,
  page,
  setPage,
}: {
  meta?: PaginatedApiResponse<unknown>;
  page?: number;
  setPage: (page: number) => void;
}) {
  return (
    <div className='flex flex-wrap gap-2 py-6 text-white text-sm'>
      <span className='flex-1 text-pumpkin/70'>
        {page &&
          meta &&
          `${(page - 1) * meta.limit + 1} - ${Math.min(
            meta.totalResults,
            page * meta.limit
          )} of ${meta.totalResults}`}
      </span>
      {Array.from({ length: meta?.totalPages ?? 1 }).map((_, i) => (
        <button
          key={i}
          className={`min-w-[24px] px-1 h-6 rounded-full border border-pumpkin ${
            page === i + 1 ? 'bg-pumpkin' : 'bg-olivine'
          }`}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
