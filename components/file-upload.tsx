"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
import { UploadFileResponse } from 'uploadthing/client';

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange?: (file: UploadFileResponse | undefined) => void;
  value: any;
  endpoint: "messageFile" | "serverImage" | "uploadFile";
}

export const FileUpload = ({
  onChange,
  value,
  endpoint
}: FileUploadProps) => {
  console.log("FileUpload component input", value);
  const fileType = value?.url?.split(".").pop();
  if (fileType && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value.url}
          alt="Upload"
          className="rounded-full"
        />
        <button
          onClick={() => onChange && onChange(undefined)}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (fileType && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a 
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value.url}
        </a>
        <button
          onClick={() => onChange && onChange(undefined)}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange && onChange(res?.[0]);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
     // onUploadBegin={(name) => {
        // Do something once upload begins
       // console.log("Uploading: ", name);
      //}}
    />
  )
}