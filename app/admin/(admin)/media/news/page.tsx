'use client';

import TextField from '@/app/admin/input';
import Pagination from '@/app/admin/pagination';
import SelectField from '@/app/admin/select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LANGUAGES_OPTIONS,
  LANGUAGE_LABEL,
  PaginatedApiResponse,
  type News,
  type AxiosApiError,
  FileUpload,
  getImgUrl,
} from '@/lib/api-types';
import { axiosClient } from '@/lib/axios';
import { TrashIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { Descendant } from 'slate';
import useSWR from 'swr';
import RichTextEditor from '../../../richtext-editor';
import FileSelector from '../../../file-selector';
import { ComboboxField } from '@/app/admin/ComboboxField';

export default function AdminNewsPage() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Partial<News> | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [language, setLanguage] = useState('all');
  const [category, setCategory] = useState('all');
  const [showFilesDialog, setShowFilesDialog] = useState(false);

  const { data, mutate } = useSWR<PaginatedApiResponse<News>>(
    `news?page=${page}${language === 'all' ? '' : `&language=${language}`}${
      category === 'all' ? '' : `&category=${category}`
    }`
  );
  const { data: item, mutate: mutateItem } = useSWR<News>(
    !!selectedItem?.id && `news/${selectedItem?.id}`
  );
  const { data: categories } = useSWR<string[]>(
    language !== 'all' ? `news/categories?language=${language}` : null
  );

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { ...DEFAULT_VALUES },
  });

  const formLanguage = form.watch('language');
  const { data: categoriesInForm } = useSWR<string[]>(
    formLanguage && `news/categories?language=${formLanguage}`
  );
  const categoriesOptions = useMemo(
    () =>
      categoriesInForm?.map((category) => ({
        label: category,
        value: category,
      })) ?? [],
    [categoriesInForm]
  );

  async function onSubmit(formData: FormData) {
    if (formData.thumbnail) {
      formData.thumbnailId = formData.thumbnail.id;
      delete formData.thumbnail;
    } else {
      return toast.error('Thumbnail is required');
    }
    setLoading(true);
    try {
      formData.publishedDate = dayjs(formData.publishedDate).toISOString();
      if (selectedItem?.id) {
        const res = await axiosClient.patch<News>(
          `news/${selectedItem.id}`,
          formData
        );
        mutateItem(res.data, { revalidate: false });
        await mutate(
          data?.results
            ? {
                ...data,
                results: data.results.map((item) =>
                  item.id === res.data.id ? res.data : item
                ),
              }
            : undefined
        );
        toast.success('Item updated');
      } else {
        const res = await axiosClient.post<News>('news', formData);
        await mutate(
          data?.results
            ? { ...data, results: [...data.results, res.data] }
            : undefined
        );
        toast.success('Item added');
      }
      setSelectedItem(null);
    } catch (error) {
      const e = error as AxiosApiError;
      toast.error(e.response?.data?.message ?? e.message);
    }
    setLoading(false);
  }

  function selectAddItem() {
    setSelectedItem({});
    form.reset({ ...DEFAULT_VALUES });
  }

  function selectEditItem(item: News) {
    setSelectedItem(item);
    form.reset({
      title: item.title,
      category: item.category,
      content: item.content,
      publishedDate: dayjs(item.publishedDate).format('YYYY-MM-DD'),
      thumbnail: item.thumbnail ?? undefined,
      language: item.language,
    });
  }

  useEffect(() => {
    if (item) {
      form.reset({
        title: item.title,
        category: item.category,
        thumbnail: item.thumbnail ?? undefined,
        publishedDate: dayjs(item.publishedDate).format('YYYY-MM-DD'),
        content: item.content,
        language: item.language,
      });
    }
  }, [form, item]);

  async function deleteItem() {
    setLoading(true);
    await axiosClient.delete(`news/${selectedItem?.id}`);
    await mutate(
      data?.results
        ? {
            ...data,
            results: data.results.filter(
              (item) => item.id !== selectedItem?.id
            ),
          }
        : undefined
    );
    toast.success('Item deleted');
    setSelectedItem(null);
    setShowDeleteDialog(false);
    setLoading(false);
  }

  const thumbnail = form.watch('thumbnail.name');

  return (
    <div className='p-10 self-stretch overflow-y-auto'>
      <div className='flex justify-end gap-4 pb-4'>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className='w-32 capitalize text-sm'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className='text-sm'>Category</SelectLabel>
              <SelectItem value='all' className='text-sm'>
                All
              </SelectItem>
              {categories?.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className='capitalize text-sm'
                >
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={language}
          onValueChange={(value) => {
            setLanguage(value);
            setCategory('all');
          }}
        >
          <SelectTrigger className='w-24 text-sm'>
            <SelectValue placeholder='Language' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className='text-sm'>Language</SelectLabel>
              <SelectItem value='all' className='text-sm'>
                All
              </SelectItem>
              <SelectItem value='en' className='text-sm'>
                English
              </SelectItem>
              <SelectItem value='dv' className='text-sm'>
                Dhivehi
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={selectAddItem}>Add Item</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead>Language</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.results?.map((item) => (
            <TableRow
              key={item.id}
              className='hover:bg-olivine/10 cursor-pointer'
              onClick={() => selectEditItem(item)}
            >
              <TableCell className='font-medium'>{item.title}</TableCell>
              <TableCell className='capitalize'>{item.category}</TableCell>
              <TableCell>
                {dayjs(item.publishedDate).format('YYYY-MM-DD')}
              </TableCell>
              <TableCell>{LANGUAGE_LABEL[item.language]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination page={page} setPage={setPage} meta={data} />

      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => open || setSelectedItem(null)}
      >
        <DialogContent
          className='max-w-2xl max-h-[93vh] overflow-y-auto'
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.id ? 'Update' : 'Add'} Item
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid md:grid-cols-2 gap-x-4 gap-y-2'
            >
              <TextField required name='title' label='Title' />
              <div className='space-y-2 row-span-5'>
                <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  Thumbnail
                </label>
                {thumbnail && (
                  <img
                    className='w-full'
                    src={getImgUrl(thumbnail, 500)}
                    alt=''
                  />
                )}
                <div className='flex'>
                  <button
                    type='button'
                    className='flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm hover:bg-sunglow transition-colors disabled:cursor-not-allowed disabled:opacity-50'
                    onClick={() => setShowFilesDialog(true)}
                  >
                    {thumbnail || 'Select thumbnail'}
                  </button>
                </div>
              </div>
              <ComboboxField
                name='category'
                label='Category'
                options={categoriesOptions}
              />
              <TextField
                name='publishedDate'
                label='Published Date'
                type='date'
              />
              <SelectField
                required
                name='language'
                label='Language'
                options={LANGUAGES_OPTIONS}
              />
              <div
                dir={form.watch('language') === 'en' ? 'ltr' : 'rtl'}
                className='relative col-span-full'
              >
                <RichTextEditor
                  key={item?.id}
                  control={form.control}
                  name='content'
                  label='Content'
                  savedValue={item?.content ?? []}
                />
              </div>
              <DialogFooter className='pt-4 col-span-full'>
                {selectedItem?.id && (
                  <Button
                    size='sm'
                    type='button'
                    disabled={loading}
                    variant='destructive'
                    className='self-center mr-auto'
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <TrashIcon />
                  </Button>
                )}
                <Button type='submit' disabled={loading}>
                  {selectedItem?.id ? 'Update' : 'Add'} Item
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle className='leading-normal'>
              Are you sure you want to delete item “{selectedItem?.title}
              ”?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className='items-center gap-3'>
            <Button
              disabled={loading}
              variant='destructive'
              onClick={deleteItem}
            >
              Yes
            </Button>
            <Button
              disabled={loading}
              variant='outline'
              onClick={() => setShowDeleteDialog(false)}
              className='w-14'
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FileSelector
        show={showFilesDialog}
        setShow={setShowFilesDialog}
        selectFile={(file) => form.setValue('thumbnail', file)}
      />
    </div>
  );
}

const DEFAULT_VALUES = {
  title: '',
  category: '',
  publishedDate: '',
  thumbnailId: null as number | null,
  thumbnail: undefined as FileUpload | undefined,
  content: [] as Descendant[],
  language: '',
};

type FormData = typeof DEFAULT_VALUES;
