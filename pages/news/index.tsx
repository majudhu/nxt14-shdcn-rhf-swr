import PageHeaderWithTag from '@/app/page-header-with-tag';
import Pagination from '@/app/pagination';
import SEO from '@/app/seo';
import FormattedLocalTime from '@/app/time';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  News,
  PaginatedApiResponse,
  apiFetch,
  getImgUrl,
  setCacheHeader,
} from '@/lib/api-types';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NewsIndexPage({
  results,
  totalPages,
  categories,
}: PageProps) {
  const { query, push } = useRouter();

  const category = (query.category as string) || 'all';
  const year = (query.year as string) || 'all';
  const search = query.search as string;

  return (
    <>
      <SEO title='News' addTitle />
      <PageHeaderWithTag tag='މީޑިއާ ސެންޓަރ' title='ޙަބަރު' />
      <div className='container grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <Select
          dir='rtl'
          value={category}
          onValueChange={(category) => {
            delete query.page;
            if (category !== 'all') query.category = category;
            else delete query.category;
            push({ query });
          }}
        >
          <SelectTrigger className='capitalize bg-ec-off py-7 border-0'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>ކެޓަގަރީ</SelectLabel>
              <SelectItem value='all'>ހުރިހާ</SelectItem>
              {categories?.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className='capitalize'
                >
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          dir='rtl'
          value={year}
          onValueChange={(year) => {
            delete query.page;
            if (year !== 'all') query.year = year;
            else delete query.year;
            push({ query });
          }}
        >
          <SelectTrigger className='capitalize bg-ec-off py-7 border-0'>
            <SelectValue placeholder='އަހަރު' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>އަހަރު</SelectLabel>
              <SelectItem value='all'>ހުރިހާ</SelectItem>
              {Array.from(
                { length: new Date().getFullYear() - 2020 },
                (_, i) => (
                  <SelectItem key={i} value={`${2022 + i}`}>
                    {2022 + i}
                  </SelectItem>
                )
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <form
          className='relative text-ec col-span-2 md:col-span-1 lg:col-span-2'
          onSubmit={(e) => {
            // @ts-expect-error elements is not typed
            const search = e.currentTarget.elements.search.value;
            e.preventDefault();
            delete query.page;
            if (search) query.search = search;
            else delete query.search;
            push({ query });
          }}
        >
          <input
            type='text'
            name='search'
            className='w-full px-5 py-3.5 rounded-20 bg-ec-off text-lg'
            placeholder='ހޯއްދަވާ'
            defaultValue={search}
          />
          <button className='absolute inset-y-4 left-4' type='submit'>
            <MagnifyingGlassIcon className='w-6 h-6' />
          </button>
        </form>
      </div>
      <div className='container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-11 gap-4 py-4'>
        {results?.map((news) => (
          <Link
            key={news.id}
            href={`/news/${news.id}`}
            className='bg-white rounded-20 p-6 group'
          >
            <span className='text-sm py-1.5 text-ec button-primary'>
              {news.category}
            </span>{' '}
            <img
              src={getImgUrl(news.thumbnail, 500)}
              alt=''
              className='w-full pt-4'
            />
            <h3 className='hd2 pt-4 pb-12 text-ec/50 group-hover:text-ec transition-colors'>
              {news.title}
            </h3>
            <div className='flex items-center justify-between gap-4'>
              <FormattedLocalTime
                className='text-sm text-neutral-400 group-hover:text-ec-light'
                dateTime={news.publishedDate}
                format='DD MMM YYYY'
              />
            </div>
          </Link>
        ))}
      </div>

      <Pagination className='container' total={totalPages} />
    </>
  );
}

export async function getServerSideProps({
  query,
  res,
}: GetServerSidePropsContext) {
  const [news, categories] = await Promise.all([
    apiFetch<PaginatedApiResponse<News>>(
      `news?language=dv&page=${query?.page || 1}${
        query?.category ? `&category=${query?.category}` : ''
      }${query?.year ? `&year=${query?.year}` : ''}${
        query?.search ? `&title=${query?.search}` : ''
      }`
    ),
    apiFetch<string[]>('news/categories?language=dv'),
  ]);
  setCacheHeader(res, 5);
  return { props: { ...news, categories } };
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
