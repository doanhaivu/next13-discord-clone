"use client";

import axios from "axios";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { absoluteUrl } from "@/lib/utils";
import { useState } from "react";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required."
  })
});

async function postFileContent(fileUrl: string) {
  try {
    // Step 1: Retrieve the file content from the URL
    const response = await axios.get(fileUrl, { responseType: 'blob' });
    const formData = new FormData();
    formData.append('file', response.data);
    formData.append('metadata', JSON.stringify({ filename: fileUrl }));
    console.log('File content retrieved successfully');

    // Step 2: Post the file content to another endpoint
    // const postUrl = process.env.RETRIEVAL_PLUGIN_URL; // replace with the URL of the endpoint you want to send the file content to
    const postUrl = absoluteUrl("/api/upsert-file");
    // if (!postUrl) throw new Error('RETRIEVAL_PLUGIN_URL is not set');

    const config = {
      headers: {
        'Authorization': `Bearer ${process.env.RETRIEVAL_PLUGIN_TOKEN}`
        // Note: When using FormData, axios will set the 'Content-Type' header to 'multipart/form-data' by default
      }
    };
    await axios.post(postUrl, formData, config);
    
    console.log('File content posted successfully');
  } catch (error) {
    console.error('Error posting file content: ', error);
  }
}

export const MessageFileModal = () => {
  const [fileName, setFileName] = useState('');
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    }
  });

  const handleClose = () => {
    form.reset();
    onClose();
  }

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      console.log('Posting message to: ', url);
      console.log('Message content: ', values);
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      await postFileContent(values.fileUrl);

      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log('Error posting message: ',error);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Gửi tệp đính kèm
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Nội dung sẽ được gửi đến Jenny Le La bot để xử lý
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={(file: any | undefined) => {
                            if (file) {
                              setFileName(file.name);
                              field.onChange(file.url);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-center text-gray-500 font-bold">
                {fileName && `Selected file: ${fileName}`}
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading || !form.formState.isValid}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}