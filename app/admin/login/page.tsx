'use client';

import TextField from '@/app/admin/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { AxiosApiError, LoginPostResponse } from '@/lib/api-types';
import { axiosClient } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';

export default function Login() {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data, error, isValidating } =
    useSWR<LoginPostResponse['user']>('auth/me');

  const form = useForm({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  async function onSubmit(formData: { email: string; password: string }) {
    try {
      setIsLoading(true);
      const { data } = await axiosClient.post<LoginPostResponse>(
        'auth/login',
        formData
      );
      axiosClient.defaults.headers.Authorization = `Bearer ${data.tokens.access.token}`;
      localStorage.setItem('accessToken', data.tokens.access.token);
      await mutate('auth/me', data.user, { revalidate: false });
    } catch (error) {
      const e = error as AxiosApiError;
      toast.error(e.response?.data?.message ?? e.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (isValidating) return;
    const accessToken = localStorage.getItem('accessToken');
    if (!error && data?.role === 'admin') {
      push('/admin');
    } else if (!error && accessToken) {
      axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
      mutate(() => true);
    }
  }, [data?.role, error, isValidating, push]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='m-auto flex flex-col items-center justify-center gap-4 rounded-20 text-white bg-pumpkin p-8 text-center'
      >
        <img src='/next.svg' className='h-11 mb-3' />
        <TextField
          required
          disabled={isLoading || isValidating}
          name='email'
          label='Email'
          placeholder='email'
          inputClass='text-center'
        />
        <TextField
          required
          disabled={isLoading || isValidating}
          name='password'
          label='Password'
          placeholder='password'
          type='password'
          inputClass='text-center'
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}

const DEFAULT_VALUES = {
  email: 'admin@vercel.app',
  password: 'admin',
};
