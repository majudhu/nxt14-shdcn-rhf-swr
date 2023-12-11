import type { BaseEditor, Descendant } from 'slate';
import { HistoryEditor } from 'slate-history';
import type { ReactEditor } from 'slate-react';
import type { CustomElement, CustomText } from './admin/richtext-editor';
import { QuoteIcon } from './icons';
import { getImgUrl } from '@/lib/api-types';

// import { Tweet } from 'react-twitter-widgets';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export function excerp(value?: Descendant[]) {
  return (
    value?.map(function serialize(node): string {
      return (
        (node as CustomText)?.text ??
        (node as CustomElement)?.children?.map((n) => serialize(n))
      );
    }) ?? []
  ).join(' ');
}

export default function RichText({
  value,
}: {
  value?: Descendant[];
}): React.ReactNode {
  return (
    // @ts-expect-error cast node to custom type
    value?.map(function serialize(
      node: CustomText & CustomElement
    ): React.ReactNode {
      if ((node as CustomText).text) {
        let text: React.ReactNode = node.text;
        if (node.bold) {
          text = <strong>{text}</strong>;
        }
        if (node.italic) {
          text = <em>{text}</em>;
        }
        if (node.underline) {
          text = <u>{text}</u>;
        }
        return text;
      }

      const children = node?.children?.map((n) =>
        serialize(n as CustomText & CustomElement)
      );

      switch (node.type) {
        case 'paragraph':
          return (
            <p className='text-lg rtl:leading-loose my-7 font-typewriter'>
              {children}
            </p>
          );
        case 'block-quote':
          return (
            <blockquote className='relative mx-auto inline-block bg-gray-100 p-3 px-4 text-lg text-black'>
              <QuoteIcon className='text-primary absolute opacity-25' />
              {children}
              <QuoteIcon className='text-primary absolute opacity-25' />
            </blockquote>
          );
        case 'bulleted-list':
          return <ul className='mx-4 list-disc'>{children}</ul>;
        case 'heading-one':
          return (
            <h3 className='rtl:font-waheed text-4xl rtl:leading-relaxed mt-14 mb-7'>
              {children}
            </h3>
          );
        case 'heading-two':
          return (
            <h4 className='rtl:font-waheed text-3xl rtl:leading-snug mt-7 mb-3'>
              {children}
            </h4>
          );
        case 'list-item':
          return <li>{children}</li>;
        case 'numbered-list':
          return <ol className='list-decimal'>{children}</ol>;

        case 'link':
          return (
            // eslint-disable-next-line react/jsx-no-target-blank
            <a href={node.url} target='_blank'>
              {children}
            </a>
          );

        case 'image':
          // eslint-disable-next-line @next/next/no-img-element
          return (
            <img
              className='my-4 w-full'
              src={getImgUrl(node.image, 1500)}
              alt=''
            />
          );

        // case 'tweet':
        //   return <Tweet dir='ltr' tweetId={node.id} />;

        case 'youtube':
          return (
            <div
              dir='ltr'
              className='relative h-0 overflow-hidden pb-[56.25%] pt-[30px]'
            >
              {children}

              <iframe
                className='absolute top-0 left-0 h-full w-full'
                width='560'
                height='315'
                src={`https://www.youtube.com/embed/${node.id}`}
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            </div>
          );

        default:
          return children;
      }
    }) ?? null
  );
}
