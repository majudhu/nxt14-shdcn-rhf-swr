import { authGuard } from '@/app/api/auth/auth-guard';
import { kv } from '@vercel/kv';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const params = new URLSearchParams(new URL(req.url).search);
  return Response.json(
    (await kv.get(
      `fixed-page-${params.get('page')}-${params.get('language')}`
    )) ?? { banners: [] }
  );
}

export async function PUT(req: NextRequest) {
  try {
    await authGuard();
  } catch (err) {
    return err as Response;
  }
  const data = await req.json();

  if (data.page === 'HomePage' && !data.banners?.length) {
    if (data.language === 'dv') data.banners = dvBanners.banners;
    else if (data.language === 'en') data.banners = enBanners.banners;
  }

  await kv.set(`fixed-page-${data.page}-${data.language}`, data);
  return Response.json(data);
}

const dvBanners = {
  banners: [
    {
      title: 'ނެކްސްޓް.ޖޭއެސް',
      description: 'The React Framework for the Web',
      link: 'https://nextjs.org/',
      image: {
        name: 'nick-andreka-eYG53JFRy9M-unsplash-02b0cce77916fe58857b.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: 'ށެޑްސީއެން/ޔޫއައި',
      description: 'Build your component library',
      link: 'https://ui.shadcn.com/',
      image: {
        name: 'ricardo-loaiza-x5F6N7HeJqo-unsplash-513404d172fd302b94fc.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: 'ރިއެކްޓް ހުކް ފޯމް',
      description:
        'Performant, flexible and extensible forms with easy-to-use validation.',
      link: 'https://react-hook-form.com/',
      image: {
        name: 'jigar-panchal-1Zza-PxlRt4-unsplash-65de71f30ec4561b91ba.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: 'ޔޫސްެ އެސް ޑަބްލިޔޫ އާރު',
      description: 'React Hooks for Data Fetching',
      link: 'https://swr.vercel.app/',
      image: {
        name: 'konstantin-evdokimov-N-r7Mktlb6w-unsplash-325c5c176d36211830f0.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: 'ޑްރިޒްލް އޯމް',
      description: 'Drizzle ORM is a headless TypeScript ORM with a head 🐲',
      link: 'https://orm.drizzle.team',
      image: {
        name: 'ricardo-loaiza-zzDnvumonDs-unsplash-6c1d738e59a0ab18125c.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: 'ޒޮޑް',
      description:
        ' TypeScript-first schema validation with static type inference ',
      link: 'https://zod.dev',
      image: {
        name: 'vadim-bogulov-A5rbfK6vbvE-unsplash-28b8f3d95eef7450e3cf.jpg',
        mimetype: 'image/jpeg',
      },
    },
  ],
  language: 'dv',
  page: 'HomePage',
};

const enBanners = {
  banners: [
    {
      title: 'Next.js',
      description: 'The React Framework for the Web',
      link: 'https://nextjs.org/',
      image: {
        name: 'nick-andreka-eYG53JFRy9M-unsplash-02b0cce77916fe58857b.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: 'shadcn/ui',
      description: 'Build your component library',
      link: 'https://ui.shadcn.com/',
      image: {
        name: 'konstantin-evdokimov-N-r7Mktlb6w-unsplash-325c5c176d36211830f0.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: ' React Hook Form',
      description:
        'Performant, flexible and extensible forms with easy-to-use validation.',
      link: 'https://react-hook-form.com/',
      image: {
        name: 'ricardo-loaiza-x5F6N7HeJqo-unsplash-513404d172fd302b94fc.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: 'useSWR',
      description: 'React Hooks for Data Fetching',
      link: 'https://swr.vercel.app/',
      image: {
        name: 'jigar-panchal-1Zza-PxlRt4-unsplash-65de71f30ec4561b91ba.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: 'Drizzle ORM',
      description: 'Drizzle ORM is a headless TypeScript ORM with a head 🐲',
      link: 'https://orm.drizzle.team',
      image: {
        name: 'nigel-hoare-bhn4m2ZDEFE-unsplash-88533747299ff3f9b177.jpg',
        mimetype: 'image/jpeg',
      },
    },
    {
      title: 'Zod',
      description:
        ' TypeScript-first schema validation with static type inference ',
      link: 'https://zod.dev',
      image: {
        name: 'peter-olexa-ZO4rHqkCat4-unsplash-45493ecd30425ba08108.jpg',
        mimetype: 'image/jpeg',
      },
    },
  ],
  language: 'en',
  page: 'HomePage',
};
