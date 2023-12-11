'use client';

import Dropzone from '@/app/admin/dropzone';
import Pagination from '@/app/admin/pagination';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {
  PaginatedApiResponse,
  AxiosApiError,
  ApiFile,
} from '@/lib/api-types';
import { axiosClient } from '@/lib/axios';
import { TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

export default function AdminFilesPage() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<Partial<ApiFile> | null>(
    null
  );
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, mutate } = useSWR<PaginatedApiResponse<ApiFile>>(
    `files?page=${page}`
  );

  async function uploadFile() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload!);
      const res = await axiosClient.post<ApiFile>('files', formData);
      await mutate(
        data?.results
          ? { ...data, results: [...data.results, res.data] }
          : undefined
      );
      toast.success('File added');
      setSelectedFile(null);
    } catch (error) {
      const e = error as AxiosApiError;
      toast.error(e.response?.data?.message ?? e.message);
    }
    setLoading(false);
  }

  async function deleteFile() {
    setLoading(true);
    await axiosClient.delete(`files/${selectedFile?.id}`);
    await mutate(
      data?.results
        ? {
            ...data,
            results: data.results.filter(
              (file) => file.id !== selectedFile?.id
            ),
          }
        : undefined
    );
    toast.success('File deleted');
    setSelectedFile(null);
    setShowDeleteDialog(false);
    setLoading(false);
  }

  return (
    <div className='p-10 self-stretch overflow-y-auto'>
      <div className='flex justify-end gap-4 pb-4'>
        <Button onClick={() => setSelectedFile({})}>Add File</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.results?.map((file) => (
            <TableRow
              key={file.id}
              className='hover:bg-olivine/10 cursor-pointer'
              onClick={() => setSelectedFile(file)}
            >
              <TableCell className='font-medium'>{file.name}</TableCell>
              <TableCell>{file.mimetype}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination page={page} setPage={setPage} meta={data} />

      <Dialog
        open={!!selectedFile}
        onOpenChange={(open) => open || setSelectedFile(null)}
      >
        <DialogContent className='max-w-lg max-h-[93vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {selectedFile?.id ? 'View File' : 'Add File'}
            </DialogTitle>
          </DialogHeader>
          <div onSubmit={uploadFile} className='space-y-2'>
            {selectedFile?.id ? (
              <object
                data={'/uploads/' + selectedFile.name}
                className='w-full h-80'
              />
            ) : (
              <Dropzone file={fileToUpload} setFile={setFileToUpload} />
            )}

            <DialogFooter className='pt-4 col-span-full'>
              {selectedFile?.id && (
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
              {selectedFile?.id ? (
                <Button asChild>
                  <a
                    download
                    target='_blank'
                    rel='noopener noreferrer'
                    href={'/uploads/' + selectedFile.name}
                  >
                    Download
                  </a>
                </Button>
              ) : (
                <Button
                  disabled={loading || !fileToUpload}
                  onClick={uploadFile}
                >
                  Add File
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle className='leading-normal'>
              Are you sure you want to delete file “{selectedFile?.name}
              ”?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className='items-center gap-3'>
            <Button
              disabled={loading}
              variant='destructive'
              onClick={deleteFile}
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
