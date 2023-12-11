import RichText from '@/app/richtext';
import SEO from '@/app/seo';
import FormattedLocalTime from '@/app/time';
import {
  News,
  PaginatedApiResponse,
  apiFetch,
  getImgUrl,
  setCacheHeader,
} from '@/lib/api-types';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Link from 'next/link';

export default function NewsArticleEnPage(article: PageProps) {
  return (
    <>
      <SEO
        title={article.title}
        description='News'
        addDesc
        image={getImgUrl(article.thumbnail, 1500)}
      />
      <main className='mx-auto max-w-[850px] gap-4 py-20 px-5 sm:px-10'>
        <p className=''>
          <span className='tag-primary'>{article.category}</span>
        </p>
        <h2 className='hd1 pt-5 pb-7 leading-none'>{article.title}</h2>
        <p className='font-sans text-ec-light'>
          {' '}
          <FormattedLocalTime
            en
            format='DD MMM YYYY'
            dateTime={article.publishedDate}
          />
        </p>

        <RichText value={article.content} />
      </main>
      <h2 className='container text-center text-[38px] pt-36 pb-14'>
        Latest News
      </h2>
      <div className='container grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-32'>
        {article.articles?.map(({ category, id, publishedDate, title }) => (
          <Link
            key={id}
            href={`/en/news/${id}`}
            className='bg-white rounded-20 p-6 group'
          >
            <span className='text-sm py-1.5 text-ec button-primary'>
              {category}
            </span>
            <h3 className='hd2 pt-7 pb-12 text-ec/50 group-hover:text-ec transition-colors'>
              {title}
            </h3>
            <div className='flex items-center justify-between gap-4'>
              <FormattedLocalTime
                en
                dateTime={publishedDate}
                format='DD MMM YYYY'
                className='text-sm text-neutral-400 group-hover:text-ec-light'
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
export async function getServerSideProps({
  params,
  res,
}: GetServerSidePropsContext) {
  const [article, news] = await Promise.all([
    apiFetch<News>(`news/${params?.id}`),
    apiFetch<PaginatedApiResponse<News>>('news?language=en'),
  ]);

  setCacheHeader(res, 5);
  return article
    ? article.language === 'dv'
      ? {
          redirect: {
            destination: `/news/${article.id}`,
          },
        }
      : {
          props: {
            ...article,
            articles: news?.results.filter((m) => m.id !== article?.id),
          },
        }
    : { notFound: true };
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
