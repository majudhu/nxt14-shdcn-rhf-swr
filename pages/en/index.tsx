import SEO from '@/app/seo';
import FormattedLocalTime from '@/app/time';
import {
  HomePage,
  NewsList,
  apiFetch,
  getImgUrl,
  setCacheHeader,
} from '@/lib/api-types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import useSWRImmutable from 'swr/immutable';

dayjs.extend(duration);

export default function HomePage({ news, homepage, newsPages }: PageProps) {
  const [activeBanner, setActiveBanner] = useState(0);
  const [morePages, setMorePages] = useState(0);

  const handleBannersScroll = useCallback((e: React.UIEvent) => {
    const { scrollLeft, clientWidth } = e.target as HTMLElement;
    const scrollIndex = -Math.round(scrollLeft / clientWidth);
    setActiveBanner(scrollIndex);
  }, []);

  return (
    <main className='container py-11'>
      <SEO />
      <div
        className='flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-10'
        onScroll={handleBannersScroll}
      >
        {homepage?.banners?.map((banner, i) => (
          <Link
            key={i}
            href={banner.link}
            className='w-full flex flex-none bg-gradient-to-bl from-gradstop/10 to-charcoal/10 rounded-20 p-8 snap-center'
          >
            <div className='flex-1'>
              <span className='rounded-10 bg-olivine/10 p-2 text-ec text-xs'>
                {banner.description}
              </span>
              <h2 className='hd1 py-8 flex-1 min-h-[150px] lg:min-h-[200px]'>
                {banner.title}
              </h2>
              <span className='tag-primary'>View More</span>
            </div>
            <img
              src={getImgUrl(banner.image, 500)}
              alt=''
              className='w-1/3 flex-none object-contain'
            />
          </Link>
        ))}
      </div>
      <div className='relative z-10'>
        <div className='absolute h-10 pt-2 pb-6 bottom-0 inset-x-0 w-full bg-[#faf8fb] z-10 flex py-2 gap-2 justify-center'>
          {homepage?.banners?.map((_, i) => (
            <button
              key={i}
              className={`h-2 rounded-full bg-olivine transition-all ${
                i === activeBanner ? 'w-11' : 'w-6 opacity-20'
              } transition`}
              onClick={handleSliderButtonsClick}
            />
          ))}
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-11 gap-4'>
        {news?.map((item) => (
          <HomeItem key={item.id} {...item} />
        ))}
        {Array.from({ length: morePages }, (_, i) => (
          <MorePage key={i} page={i + 2} />
        ))}
      </div>

      {morePages + 1 < newsPages! && (
        <button
          className='block w-fit mx-auto border border-ec px-2 py-1 text-sm text-ec rounded-10'
          onClick={() => setMorePages(morePages + 1)}
        >
          Load More
        </button>
      )}
    </main>
  );
}

function HomeItem(item: NewsList['results'][number]) {
  return (
    <Link
      key={item.id}
      href={`/news/${item.id}`}
      className='bg-white rounded-20 p-6 group'
    >
      <span className='text-sm border border-olivine rounded-10 p-2 text-ec'>
        {item.category}
      </span>
      {item.thumbnail && (
        <img
          src={getImgUrl(item.thumbnail, 500)}
          className='w-full pt-4 pb-2'
          alt=''
        />
      )}

      <h3
        className={`hd2 text-ec/70 group-hover:text-ec transition-colors ${
          item.thumbnail ? 'pb-7' : 'py-7'
        } `}
      >
        {item.title}
      </h3>
      <div className='flex opacity-70 group-hover:opacity-100 transition-opacity'>
        <FormattedLocalTime
          className='flex-1 text-ec'
          format='DD MMM YYYY'
          dateTime={item.publishedDate}
        />
      </div>
    </Link>
  );
}

function MorePage({ page }: { page: number }) {
  const { data } = useSWRImmutable<NewsList>(`news?language=en&page=${page}`);
  return data?.results?.map((item) => <HomeItem key={item.id} {...item} />);
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  const [news, homepage] = await Promise.all([
    apiFetch<NewsList>('news?language=en'),
    apiFetch<HomePage>('fixed-pages?page=HomePage&language=en'),
  ]);
  setCacheHeader(res, 5);
  return {
    props: {
      news: news?.results ?? null,
      newsPages: news?.totalPages,
      homepage,
    },
  };
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function handleSliderButtonsClick(e: React.MouseEvent<HTMLElement>) {
  const buttons = e.currentTarget.parentElement!;
  const index = Array.from(buttons.children).indexOf(e.currentTarget);
  const slider = buttons.parentElement!.previousSibling as HTMLElement;
  const left = (slider.scrollWidth / buttons.children.length) * (index + 0.5);
  slider.scroll(-left, 0);
}
