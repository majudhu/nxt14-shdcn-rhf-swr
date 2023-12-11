'use client';

import FileSelector from '@/app/admin/file-selector';
import TextField from '@/app/admin/input';
import { Button } from '@/components/ui/button';
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
  FileUpload,
  HomePage,
  getImgUrl,
  type AxiosApiError,
} from '@/lib/api-types';
import { axiosClient } from '@/lib/axios';
import { TrashIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';

export default function AdminHomeBannerPage() {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('dv');
  const [selectFileForm, setShowSelectFileForm] =
    // @ts-expect-error dialog wont be show if selectFileFor is blank
    useState<`banners.${number}.image`>('');

  const { data, mutate } = useSWR<HomePage>(
    `fixed-pages?page=HomePage&language=${language}`
  );

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const banners = useFieldArray({
    control: form.control,
    name: 'banners',
  });

  async function onSubmit(formData: FormData) {
    for (const banner of formData.banners) {
      if (!banner.image?.name) return toast.error('Image is required');
      if (!banner.description) delete banner.description;
    }
    setLoading(true);
    try {
      const { data } = await axiosClient.put<HomePage>('fixed-pages', {
        ...formData,
        language,
        page: 'HomePage',
      });
      await mutate(data, { revalidate: false });
      toast.success('Home banners updated');
    } catch (error) {
      const e = error as AxiosApiError;
      toast.error(e.response?.data?.message ?? e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (data) {
      form.reset({
        banners: data.banners.map(({ title, description, image, link }) => ({
          title,
          description,
          link,
          image: { name: image.name, mimetype: image.mimetype },
        })),
      });
    }
  }, [form, data]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='p-10 space-y-4'>
          <div className='flex items-center gap-3 text-sm'>
            Language:
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className='w-24 text-sm'>
                <SelectValue placeholder='Language' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className='text-sm'>Language</SelectLabel>
                  <SelectItem value='en' className='text-sm'>
                    English
                  </SelectItem>
                  <SelectItem value='dv' className='text-sm'>
                    Dhivehi
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <h3 className='col-span-full text-sm font-semibold pt-1'>
            Home Page Banners
          </h3>
          {banners.fields.map((field, index) => {
            const image = form.watch(`banners.${index}.image.name`);
            return (
              <div
                key={field.id}
                className='border border-olivine rounded-10 p-2 space-y-3 md:flex gap-5'
              >
                <div className='flex-1 space-y-2'>
                  <TextField
                    name={`banners.${index}.title`}
                    label='Title'
                    classname='flex-1'
                  />
                  <TextField
                    name={`banners.${index}.description`}
                    label='Description'
                  />
                  <TextField name={`banners.${index}.link`} label='Link' />
                  <div className='pt-5'>
                    <Button
                      type='button'
                      size='sm'
                      variant='destructive'
                      onClick={() => banners.remove(index)}
                    >
                      <TrashIcon /> Remove Banner
                    </Button>
                  </div>
                </div>
                <div className='w-1/3'>
                  <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2'>
                    Image
                  </label>
                  {image && (
                    <img
                      className='w-full'
                      src={getImgUrl(image, 500)}
                      alt=''
                    />
                  )}
                  <div className='flex'>
                    <button
                      type='button'
                      className='flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm hover:bg-sunglow transition-colors disabled:cursor-not-allowed disabled:opacity-50'
                      onClick={() =>
                        setShowSelectFileForm(`banners.${index}.image`)
                      }
                    >
                      {image || 'Select image'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div className='flex gap-4'>
            <Button
              type='button'
              onClick={() =>
                banners.append({
                  title: '',
                  description: '',
                  image: null,
                  link: '',
                })
              }
            >
              Add Banner
            </Button>
            <Button type='submit' disabled={loading}>
              Save
            </Button>
          </div>
        </form>
      </Form>

      <FileSelector
        show={!!selectFileForm}
        // @ts-expect-error dialog wont be show if selectFileFor is blank
        setShow={(show) => show || setShowSelectFileForm('')}
        selectFile={(file) => form.setValue(selectFileForm, file)}
      />
    </>
  );
}

const DEFAULT_VALUES = {
  banners: [] as {
    title: string;
    description?: string;
    image: FileUpload | null;
    link: string;
  }[],
  language: 'dv',
};

type FormData = typeof DEFAULT_VALUES;
