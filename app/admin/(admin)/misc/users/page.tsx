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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {
  AxiosApiError,
  PaginatedApiResponse,
  User,
} from '@/lib/api-types';
import { axiosClient } from '@/lib/axios';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, mutate } = useSWR<PaginatedApiResponse<User>>(
    `users?page=${page}`
  );

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  async function onSubmit(formData: FormData) {
    if (
      (formData.password || formData.confirmPassword) &&
      formData.password !== formData.confirmPassword
    ) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      if (selectedUser?.id) {
        const res = await axiosClient.patch<User>(`users/${selectedUser.id}`, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password || undefined,
        });
        await mutate(
          data?.results
            ? {
                ...data,
                results: data.results.map((user) =>
                  user.id === res.data.id ? res.data : user
                ),
              }
            : undefined
        );
        toast.success('User updated');
      } else {
        const res = await axiosClient.post<User>('users', {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        });
        await mutate(
          data?.results
            ? { ...data, results: [...data.results, res.data] }
            : undefined
        );
        toast.success('User added');
      }
      setSelectedUser(null);
    } catch (error) {
      const e = error as AxiosApiError;
      toast.error(e.response?.data?.message ?? e.message);
    }
    setLoading(false);
  }

  function selectAddUser() {
    setSelectedUser({});
    form.reset({ ...DEFAULT_VALUES });
  }

  function selectEditUser(user: User) {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
  }

  async function deleteUser() {
    setLoading(true);
    await axiosClient.delete(`users/${selectedUser?.id}`);
    await mutate(
      data?.results
        ? {
            ...data,
            results: data.results.filter(
              (item) => item.id !== selectedUser?.id
            ),
          }
        : undefined
    );
    toast.success('User deleted');
    setSelectedUser(null);
    setShowDeleteDialog(false);
    setLoading(false);
  }

  return (
    <div className='p-10 self-stretch overflow-y-auto'>
      <div className='flex justify-end gap-4 pb-4'>
        <Button onClick={selectAddUser}>Add User</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.results?.map((user) => (
            <TableRow
              key={user.id}
              className='hover:bg-olivine/10 cursor-pointer'
              onClick={() => selectEditUser(user)}
            >
              <TableCell className='font-medium'>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination page={page} setPage={setPage} meta={data} />

      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => open || setSelectedUser(null)}
      >
        <DialogContent className='max-w-sm max-h-[93vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.id ? 'Update' : 'Add'} User
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <TextField required name='name' label='Name' />
              <TextField required name='email' label='Email' />
              <SelectField required name='role' label='Role' options={ROLES} />
              <TextField name='password' label='Password' type='password' />
              <TextField
                name='confirmPassword'
                label='Confirm Password'
                type='password'
              />
              <DialogFooter className='pt-4'>
                {selectedUser?.id! > 1 && (
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
                  {selectedUser?.id ? 'Update' : 'Add'} User
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
              Are you sure you want to delete item “{selectedUser?.name}
              ”?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className='items-center gap-3'>
            <Button
              disabled={loading}
              variant='destructive'
              onClick={deleteUser}
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
    </div>
  );
}

const DEFAULT_VALUES = {
  role: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

type FormData = typeof DEFAULT_VALUES;

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'content', label: 'Content' },
];
