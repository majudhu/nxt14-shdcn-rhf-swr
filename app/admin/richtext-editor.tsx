import { getImgUrl, type ApiFile, type AxiosApiError } from '@/lib/api-types';
import { axiosClient } from '@/lib/axios';
import { PhotoIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import type { BaseEditor } from 'slate';
import {
  Editor,
  Element as SlateElement,
  Transforms,
  createEditor,
  type Descendant,
} from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSelected,
  useSlate,
  withReact,
  type ReactEditor,
} from 'slate-react';
import {
  BoldIcon,
  HeadingIcon,
  ItalicIcon,
  OrderedListIcon,
  QuoteIcon,
  RedoIcon,
  UnOrderedListIcon,
  UnderlineIcon,
  UndoIcon,
} from '../icons';

// import { Tweet } from 'react-twitter-widgets';

export type CustomElement = {
  type: string;
  children: CustomText[];
  image?: string;
  url?: string;
  id?: string;
};

export type CustomText = {
  text: string;
  bold?: true;
  type?: string;
  italic?: boolean;
  underline?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const INITIAL_VALUE: Descendant[] = [
  { type: 'paragraph', children: [{ text: '' }] } as CustomElement,
];

export default function RichTextEditor<T extends FieldValues>({
  control,
  name,
  label,
  savedValue,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  savedValue?: Descendant[];
}) {
  const [value, setValue] = useState(savedValue ?? INITIAL_VALUE);

  const editor = useMemo(() => {
    const editor = withReact(withHistory(createEditor()));

    const { isInline, isVoid } = editor;

    editor.isVoid = (element) =>
      ['image', 'tweet'].includes((element as CustomElement).type)
        ? true
        : isVoid(element);

    editor.isInline = (element) =>
      (element as CustomElement).type === 'link' ? true : isInline(element);

    return editor; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    field: { onChange },
  } = useController<T>({ name, control });

  useEffect(() => {
    if (typeof (savedValue?.[0] as CustomElement)?.type != 'string') {
      onChange(INITIAL_VALUE);
      setValue(INITIAL_VALUE);
    } // eslint-disable-next-line react-hooks/exhaustive-deps -- onchange is not stable
  }, [savedValue]);

  if (typeof (value?.[0] as CustomElement)?.type != 'string') {
    return null;
  }

  async function onUpload(e: React.FormEvent<HTMLInputElement>) {
    const file = (e.target as HTMLFormElement).files[0];
    // if (file?.size > 5242880) {
    //   return toast.error('File size too large, it should be less than 5 MB');
    // }
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosClient.post<ApiFile>('files', formData);
      Transforms.insertNodes(editor, {
        type: 'image',
        image: res.data.name,
        children: [{ text: '' }],
      } as CustomElement);
    } catch (error) {
      const e = error as AxiosApiError;
      toast.error(e.response?.data?.message ?? e.message);
    }
  }

  // async function onUpload(blob) {
  //   try {
  //     const formData = new FormData();
  //     formData.append('file', blob);
  //     const res = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API}/files`,
  //       formData
  //     );
  //     Transforms.insertNodes(editor, {
  //       type: 'image',
  //       image: `${process.env.NEXT_PUBLIC_IMAGE}/500/${res.key}.webp`,
  //       children: [{ text: '' }],
  //     });
  //   } catch (err) {
  //     toast.error(err?.response?.data?.error ?? err.message);
  //   }
  // }

  return (
    <Slate editor={editor} initialValue={value} onChange={onChange}>
      <div
        className='sticky top-0 z-10 mb-3 flex select-none items-center divide-x divide-gray-300 rounded-t-[10px] border-b bg-gray-100 py-3 text-base'
        onMouseDown={(e) => e.preventDefault()}
      >
        <h2 className='mx-4 font-bold text-gray-600'> {label} </h2>
        <div className='flex items-center px-2'>
          <button
            type='button'
            className={clsx(
              'rounded-full p-1 ',
              editor.history.undos.length
                ? 'text-gray-800 hover:text-yellow-500'
                : 'text-gray-500'
            )}
            disabled={!editor.history.undos.length}
            style={{ userSelect: 'none' }}
            onClick={() => HistoryEditor.undo(editor)}
          >
            <UndoIcon className='h-5 w-5' />
          </button>
          <button
            type='button'
            className={clsx(
              'rounded-full p-1 ',
              editor.history.redos.length
                ? 'text-gray-800 hover:text-yellow-500'
                : 'text-gray-500'
            )}
            disabled={!editor.history.redos.length}
            onClick={() => HistoryEditor.redo(editor)}
          >
            <RedoIcon className='h-5 w-5' />
          </button>
        </div>
        <div className='flex items-center px-2'>
          <MarkButton format='bold' icon={<BoldIcon className='h-5 w-5' />} />
          <MarkButton
            format='italic'
            icon={<ItalicIcon className='h-5 w-5' />}
          />
          <MarkButton
            format='underline'
            icon={<UnderlineIcon className='h-5 w-5' />}
          />
        </div>
        <div className='flex items-center px-2'>
          <BlockButton
            format='heading-one'
            icon={<HeadingIcon className='h-5 w-5' />}
            label='1'
          />
          <BlockButton
            format='heading-two'
            icon={<HeadingIcon className='h-5 w-5' />}
            label='2'
          />
        </div>
        <div className='flex items-center px-2'>
          <BlockButton
            format='block-quote'
            icon={<QuoteIcon className='h-5 w-5' />}
          />
          <BlockButton
            format='numbered-list'
            icon={<OrderedListIcon className='h-5 w-5' />}
          />
          <BlockButton
            format='bulleted-list'
            icon={<UnOrderedListIcon className='h-5 w-5' />}
          />
        </div>

        <label className='w-40 pl-2 text-gray-500'>
          <PhotoIcon className='h-5 w-5 cursor-pointer' />
          <input
            type='file'
            className='sr-only'
            onChange={onUpload}
            accept='image/*'
          />
        </label>
      </div>
      <Editable
        renderElement={Element}
        renderLeaf={Leaf}
        className='min-h-[300px] px-3'
      />
    </Slate>
  );
}

function toggleBlock(editor: Editor, format: string) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as CustomElement).type),
    split: true,
  });
  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  } as CustomElement);

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    } as CustomElement);
  }
}

function isBlockActive(editor: Editor, format: string) {
  if (!editor.selection) return false;

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, editor.selection),
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as CustomElement).type === format,
  });

  return !!match;
}

function Element({ attributes, children, element }: RenderElementProps) {
  const selected = useSelected();

  switch ((element as CustomElement).type) {
    case 'block-quote':
      return (
        <blockquote className='mx-auto inline-block p-3 px-4 text-xl font-bold text-black'>
          <span
            contentEditable='false'
            className='ml-1 select-none text-[48px] text-[#ACD143]'
          >
            &rdquo;
          </span>
          {children}
          <span
            contentEditable='false'
            className='relative bottom-[-7px] mr-2 select-none text-2xl text-[#ACD143]'
          >
            &ldquo;
          </span>
        </blockquote>
      );
    case 'heading-one':
      return (
        <h3
          className='rtl:font-waheed text-4xl rtl:leading-relaxed mt-14 mb-7'
          {...attributes}
        >
          {children}
        </h3>
      );
    case 'heading-two':
      return (
        <h4
          className='rtl:font-waheed text-3xl rtl:leading-relaxed mt-7 mb-3'
          {...attributes}
        >
          {children}
        </h4>
      );
    case 'numbered-list':
      return (
        <ol className='mx-4 list-decimal' {...attributes}>
          {children}
        </ol>
      );
    case 'bulleted-list':
      return (
        <ul className='mx-4 list-disc' {...attributes}>
          {children}
        </ul>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;

    case 'link':
      return (
        // eslint-disable-next-line react/jsx-no-target-blank
        <a
          {...attributes}
          href={(element as CustomElement).url}
          className={selected ? 'bg-yellow-400' : ''}
          target='_blank'
        >
          {children}
        </a>
      );

    case 'image':
      return (
        <div
          {...attributes}
          contentEditable={false}
          className={`my-4 w-full border-2 ${
            selected ? 'border-primary' : 'border-white'
          }`}
        >
          {children}
          <div contentEditable={false}>
            <img
              alt=''
              className='w-full'
              src={getImgUrl((element as CustomElement).image, 1500)}
            />
          </div>
        </div>
      );

    // case 'tweet':
    //   return (
    //     <div
    //       {...attributes}
    //       contentEditable={false}
    //       className={`pointer-events-none my-4 w-full border-2 ${
    //         selected ? 'border-primary' : 'border-white'
    //       }`}
    //     >
    //       {children}
    //       <Tweet
    //         tweetId={element.id}
    //         renderError={(e) => (
    //           <p
    //             dir='ltr'
    //             className='mb-0 border-2 border-red-600 py-2 text-center font-sans font-bold text-red-600'
    //           >
    //             {e.message}
    //           </p>
    //         )}
    //       />
    //     </div>
    //   );

    case 'youtube':
      return (
        <div
          {...attributes}
          contentEditable={false}
          className={`pointer-events-none relative my-4 h-0 w-full overflow-hidden border-2 pb-[56.25%] pt-[30px] ${
            selected ? 'border-primary' : 'border-white'
          }`}
        >
          {children}

          <iframe
            className='absolute top-0 left-0 h-full w-full'
            width='560'
            height='315'
            src={`https://www.youtube.com/embed/${
              (element as CustomElement).id
            }`}
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      );

    default:
      return <p {...attributes}>{children}</p>;
  }
}

function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if ((leaf as CustomText).bold) {
    children = <strong>{children}</strong>;
  }
  if ((leaf as CustomText).italic) {
    children = <em>{children}</em>;
  }
  if ((leaf as CustomText).underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
}

function MarkButton({
  format,
  icon,
}: {
  format: string;
  icon: React.ReactNode;
}) {
  const editor = useSlate(); // @ts-expect-error easiest is not to type this
  const isMarked = Editor.marks(editor)?.[format];
  return (
    <button
      type='button'
      className={clsx(
        'flex items-center justify-center rounded-full p-1 hover:text-yellow-500',
        isMarked ? 'text-gray-800 ' : 'text-gray-500'
      )}
      onClick={() =>
        isMarked
          ? Editor.removeMark(editor, format)
          : Editor.addMark(editor, format, true)
      }
    >
      {icon}
    </button>
  );
}

function BlockButton({
  format,
  icon,
  label,
}: {
  format: string;
  icon: React.ReactNode;
  label?: React.ReactNode;
}) {
  const editor = useSlate();
  return (
    <button
      type='button'
      className={clsx(
        'flex items-center p-1 hover:text-yellow-500 ',
        isBlockActive(editor, format) ? 'text-black' : 'text-gray-500'
      )}
      onClick={() => toggleBlock(editor, format)}
    >
      {icon}
      {label && <span className='text-lg'>{label}</span>}
    </button>
  );
}

// function isLinkActive(editor: Editor) {
//   const [link] = Editor.nodes(editor, {
//     match: (n) =>
//       !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
//   });
//   return !!link;
// }

// function unwrapLink(editor: Editor) {
//   if (isLinkActive(editor)) {
//     Transforms.unwrapNodes(editor, {
//       match: (n) =>
//         !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
//     });
//   }
// }

// function wrapLink(editor: Editor, url: string) {
//   unwrapLink(editor);

//   const { selection } = editor;
//   const isCollapsed = selection && Range.isCollapsed(selection);
//   const link = {
//     type: 'link',
//     url,
//     children: isCollapsed ? [{ text: url }] : [],
//   };

//   if (isCollapsed) {
//     Transforms.insertNodes(editor, link);
//   } else {
//     Transforms.wrapNodes(editor, link, { split: true });
//     Transforms.collapse(editor, { edge: 'end' });
//   }
// }
