import { DocumentArrowUpIcon } from '@heroicons/react/24/solid';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Dropzone({
  file,
  setFile,
}: {
  file?: File | null;
  setFile: (file: File) => void;
}) {
  const onDrop = useCallback(
    ([file]: File[]) => {
      setFile(file);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className='border border-olivine rounded-10 bg-sunglow text-center py-6 text-charcoal cursor-pointer'
    >
      <input {...getInputProps()} />
      <DocumentArrowUpIcon className='w-8 h-8 mx-auto opacity-50 mb-3' />
      {isDragActive ? (
        <p className='my-auto'>Drop the files here ...</p>
      ) : (
        <p className='my-auto'>
          Drag file here to upload, or click to select file
        </p>
      )}
      <p className='mt-2 font-medium'>{file?.name}</p>
    </div>
  );
}
