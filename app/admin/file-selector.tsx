import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getImgUrl,
  type ApiFile,
  type FileUpload,
  type PaginatedApiResponse,
} from '@/lib/api-types';
import { useState } from 'react';
import useSWR from 'swr';
import Pagination from './pagination';

export default function FileSelector({
  show,
  setShow,
  selectFile,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  selectFile: (fileId: FileUpload) => void;
}) {
  const [page, setPage] = useState(1);

  const { data } = useSWR<PaginatedApiResponse<ApiFile>>(`files?page=${page}`);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className='max-w-2xl max-h-[93vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='leading-normal'>
            Select uploaded file
          </DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
          {data?.results.map((file) => (
            <button
              key={file.id}
              className='block break-all overflow-hidden border border-pumpkin hover:bg-sunglow p-2 rounded-10'
              onClick={() => {
                setShow(false);
                selectFile(file);
              }}
            >
              {file.mimetype?.startsWith('image/') && (
                <img
                  src={getImgUrl(file.name, 500)}
                  className='h-24 object-contain'
                  alt=''
                />
              )}
              {file.name}
            </button>
          ))}
        </div>
        <DialogFooter>
          <Pagination page={page} setPage={setPage} meta={data} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
