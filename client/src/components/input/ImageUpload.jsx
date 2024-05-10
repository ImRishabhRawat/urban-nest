import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { TbPhotoPlus } from 'react-icons/tb'
import useCloudinaryUpload from '../../hooks/useCloudinaryUpload';


const ImageUpload = ({onChange, value}) => {

  const { uploadToCloudinary } = useCloudinaryUpload();

   const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(async file => {
      const data = await uploadToCloudinary(file);
      onChange(data.url);  // Here we call the onChange function with the URL of the uploaded image
    });
  }, [onChange, uploadToCloudinary]);

  const {getRootProps, getInputProps, open} = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: true,
  });

  return (
    <div {...getRootProps()} className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600 h-[300px]">
      <input {...getInputProps()} />
      <TbPhotoPlus size={24} onClick={open} />
      <div className="font-semibold text-lg">
        Click to upload
      </div>
      {value && (
        <div className="absolute inset-0 w-full h-full overflow-y-auto scroll">
          <img src={value} alt="upload" style={{objectFit: 'cover'}} />
        </div>
      )}
    </div>
  )
}

export default ImageUpload
