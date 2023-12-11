import Head from 'next/head';
import { useRouter } from 'next/router';

const TITLE = 'NXT14-SHDCN-RHF-SWR';
const URL = 'https://nxt14-shdcn-rhf-swr.vercel.app';
const DESCRIPTION =
  'Nextjs 14 + shadcn/ui + react-hook-forms + useSWR + drizzle';

export default function SEO({
  title,
  addTitle,
  description,
  addDesc,
  image,
}: {
  title?: string;
  addTitle?: boolean;
  description?: string;
  addDesc?: boolean;
  image?: string;
}) {
  const { asPath } = useRouter();

  const smTitle = addTitle ? `${title} - ${TITLE}` : title ?? TITLE;
  const smDescription = addDesc
    ? `${description} - ${TITLE}`
    : description ?? (title && !addTitle ? TITLE : DESCRIPTION);

  return (
    <Head>
      <title>{title ? `${title} - ${TITLE}` : TITLE}</title>
      <meta
        name='description'
        content={title ? description ?? TITLE : DESCRIPTION}
      />
      <link rel='canonical' href={URL} />
      <link rel='icon' href='/next.svg' type='image/svg+xml' />
      <meta property='og:url' content={URL + asPath} />
      <meta property='og:title' content={smTitle} />
      <meta property='og:description' content={smDescription} />
      <meta
        property='og:image'
        name='image'
        content={URL + (image ?? '/sm-card.png')}
      />
      <meta property='og:updated_time' content={new Date().toISOString()} />
      <meta property='og:site_name' content={TITLE} itemProp='name' />
      <meta property='og:type' content='website' />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@majudhu' />
      <meta name='twitter:title' content={smTitle} />
      <meta property='twitter:url' content={URL + asPath} />
      <meta name='twitter:description' content={smDescription} />
      {image && <meta name='twitter:image' content={URL + image} />}
      <meta
        name='viewport'
        content='height=device-height, width=device-width, maximum-scale=1.0, minimum-scale=1.0, initial-scale=1.0, user-scalable=no'
      />
    </Head>
  );
}
