// 'use client';

// import { useMutation, useQuery } from '@tanstack/react-query';
// import { Inbox,Loader2  } from 'lucide-react';
// import React from 'react';
// import { useDropzone } from 'react-dropzone'
// import { uploadToS3 } from '~/lib/s3';
// import { toast } from "react-hot-toast";
// import axios from 'axios';
// import {useRouter} from 'next/navigation';
// import { useState } from "react";
// import { Button } from './ui/button';
// import { generateTitle } from '~/app/actions/getTitleUploadDB';
// type Props = {
//     isPro: boolean;
//   };
// const FileUploadPaper = (userId) => {
//   const router = useRouter()
//   const [uploading, setUploading] = React.useState(false);
//   const [abstractText, setAbstractText] = useState("");
//   const [acceptedFile, setAcceptedFile] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [fileKey, setFileKey] = useState("");
//   const [fileName, setFileName] = useState("");


//   const { mutate, isPending } = useMutation({
//         mutationFn: async ({
//           file_key,
//           file_name,
//           abstract,
//         }: {
//           file_key: string;
//           file_name: string;
//           abstract: string;
//         }) => {
//           try {
//             const response = await axios.post("/api/create-paper", {
//               file_key,
//               file_name,
//               abstract,
//             });
//             console.log(response.data)
//             // const { data: title, isLoading, error } = useQuery({
//             //   queryKey: ['getTitleGen', paperId],
//             //   queryFn: async () => {
//             //     try {
//             //       const response = await axios.post(`/api/get-title-gen-paper`, { paperId });
//             //       return response.data;
//             //     } catch (err) {
//             //       console.error('Error fetching generated title:', err);
//             //       throw err;
//             //     }
//             //   },
//             //   onSuccess: (data) => {
//             //     console.log('Generated title received:', data);
//             //   },
//             //   onError: (err) => {
//             //     console.error('Error fetching generated title:', err);
//             //   }
//             // });

//             return response.data;
//           } catch (error) {
//             console.error("Error making API request", error);
//             throw error;
//           }
//         },
//       });

//     const { getRootProps, getInputProps } = useDropzone({
//         accept: { "application/pdf": [".pdf"] },
//         maxFiles: 1,
//         // eslint-disable-next-line @typescript-eslint/no-misused-promises
//         onDrop: async (acceptedFiles) => {
//             console.log('Accepted files:', acceptedFiles);
//             const file = acceptedFiles[0];
//             if (file.size > 10 * 1024 * 1024) {
//                 alert('Please upload a smaller file');
//                 return;
//             }

//             try {
//                 setUploading(true);
//                 const data = await uploadToS3(file);
//                 setAcceptedFile(file);
//                 setFileKey(data.file_key);
//                 setFileName(data.file_name);
//                 console.log('S3 upload data:', data);
//                 if (!data?.file_key || !data.file_name) {
//                     toast.error("Something went wrong");
//                     return;
//                 }

//                 // mutate(data, {
//                 //     onSuccess: ({chat_id}) => {
//                 //         toast.success("Chat created!");
//                 //         console.log(`chat id is: ${chat_id}`);
//                 //         // router.push(`/chat/${chat_id}`);

//                 //     },
//                 //     onError: (err) => {
//                 //         toast.error("Error creating chat");
//                 //         console.error('Mutation error', err);
//                 //     }
//                 // });
//             } catch (error) {
//                 console.error('Error during file upload', error);
//                 toast.error("Error uploading file");
//             } finally {
//               setUploading(false);
//             }
//         }
//     });

//     const handleAbstractChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       setAbstractText(event.target.value);
//     };
//     const handleSubmit = async () => {
//       // event.preventDefault();
//       if (!fileKey || !fileName) {
//         toast.error("File not uploaded yet");
//         return;
//       }
//       setSubmitting(true);
//       mutate({
//         file_key: fileKey,
//         file_name: fileName,
//         abstract: abstractText,
//       }, {
//         onSuccess: ({ paper_id }) => {
//           toast.success("Paper created!");
//           console.log(`Paper id is: ${paper_id}`);
//           const {text, link} = generateTitle(paper_id);
//           console.log(text, link);
//           router.push(`/dashboard/${userId}/${paper_id}`);
//         },
//         onError: (err) => {
//           toast.error("Error creating chat");
//           console.error('Mutation error', err);
//         },
//         onSettled: () => {
//           setSubmitting(false); // Stop the spinner after the submission process
//         }
//       });
//     };
    

//     return (
// <div className='p-4 bg-white rounded-xl w-96'> {/* Increase padding for overall size */}
//     <div {...getRootProps({
//         className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-12 flex justify-center items-center flex-col' // Increase py for internal spacing
//     })}>
//         <input {...getInputProps()} />
        
//         {uploading || isPending ? (
//           <>
//             <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
//             <p className="mt-2 text-sm text-slate-400">
//             Spilling Tea to clickbait...
//           </p>
//           </>
//         ):
//         <>
//         <Inbox className="w-16 h-16 text-teal-700" /> {/* Increase width and height for the icon */}
//         <p className="mt-4 text-base text-slate-400">Drop PDF Here</p> {/* Adjust margin and text size */}
//     </>
//         }

//     </div>

//       <div className="my-4">
//           <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">Abstract:</label>
//           <textarea
//             id="abstract"
//             value={abstractText}
//             onChange={handleAbstractChange}
//             rows={4}
//             className="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
//           />
//       </div>
//       <div className="flex justify-center">
//           <Button 
//             type="submit" 
//             onClick={handleSubmit}
//             className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-800 hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          
//           >
//             Submit
//           </Button>
//       </div>

// </div>
//     );
// };

// export default FileUploadPaper;

'use client';

import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadToS3 } from '~/lib/s3';
import { toast } from "react-hot-toast";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { generateTitle } from '~/app/actions/getTitleUploadDB';

const FileUploadPaper = ({ userId }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [abstractText, setAbstractText] = useState("");
  const [acceptedFile, setAcceptedFile] = useState(null);
  const [fileKey, setFileKey] = useState("");
  const [fileName, setFileName] = useState("");

  const { mutate } = useMutation({
    mutationFn: async ({ file_key, file_name, abstract }) => {
      try {
        const response = await axios.post("/api/create-paper", {
          file_key,
          file_name,
          abstract,
        });
        return response.data;
      } catch (error) {
        console.error("Error making API request", error);
        throw error;
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('Please upload a smaller file');
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        setAcceptedFile(file);
        setFileKey(data.file_key);
        setFileName(data.file_name);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }
      } catch (error) {
        console.error('Error during file upload', error);
        toast.error("Error uploading file");
      } finally {
        setUploading(false);
      }
    }
  });

  const handleAbstractChange = (event) => {
    setAbstractText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!fileKey || !fileName) {
      toast.error("File not uploaded yet");
      return;
    }
    setSubmitting(true);
    mutate({
      file_key: fileKey,
      file_name: fileName,
      abstract: abstractText,
    }, {
      onSuccess: ({ paper_id }) => {
        toast.success("Paper created!");
        const { text, link } = generateTitle(paper_id);
        console.log(text, link);
        router.push(`/dashboard/${userId}/${paper_id}`);
      },
      onError: (err) => {
        toast.error("Error creating paper");
        console.error('Mutation error', err);
      },
      onSettled: () => {
        setSubmitting(false);
      }
    });
  };

  return (
    <div className='p-4 bg-white rounded-xl w-96'>
      <div {...getRootProps({
        className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-12 flex justify-center items-center flex-col'
      })}>
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Uploading...</p>
          </>
        ) : acceptedFile ? (
          <>
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="mt-2 text-sm text-slate-400">PDF uploaded: {acceptedFile.name}</p>
          </>
        ) : (
          <>
            <Inbox className="w-16 h-16 text-teal-700" />
            <p className="mt-4 text-base text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>

      <div className="my-4">
        <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">Abstract:</label>
        <textarea
          id="abstract"
          value={abstractText}
          onChange={handleAbstractChange}
          rows={4}
          className="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2"
          style={{ cursor: 'text' }}
        />
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-800 hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={submitting || !abstractText}
        >
          {submitting ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUploadPaper;


