import Spacer from "@/components/ui/Spacer";
import { FileIcon, Trash2Icon, UploadCloudIcon } from "lucide-react";
import * as React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";

const variants = {
  base: "relative rounded-md p-4 w-96 max-w-[calc(100vw-1rem)] flex justify-center items-center flex-col cursor-pointer border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700 dark:border-gray-600",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

export type FileState = {
  file: File;
  key: string; // used to identify the file in the progress callback
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const MultiFileDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      dropzoneOptions,
      value = [],
      className,
      disabled,
      onFilesAdded,
      onChange,
    },
    ref
  ) => {
    const [customError, setCustomError] = React.useState<string>();

    const handleFileDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        setCustomError(undefined);
        if (
          dropzoneOptions?.maxFiles &&
          value.length + acceptedFiles.length > dropzoneOptions.maxFiles
        ) {
          setCustomError(
            `You can only add ${dropzoneOptions.maxFiles} file(s).`
          );
          return;
        }

        const addedFiles = acceptedFiles.map<FileState>((file) => ({
          file,
          key: Math.random().toString(36).slice(2),
          progress: "PENDING",
        }));

        onFilesAdded?.(addedFiles);
      },
      [dropzoneOptions, onFilesAdded, value.length]
    );

    const handleUpload = () => {
      // Simulated upload process
      const updatedFiles = value.map((fileState) => ({
        ...fileState,
        progress: "COMPLETE" as "COMPLETE",
      }));
      onChange?.(updatedFiles);
    };

    const handleDelete = (index: number) => {
      onChange?.(value.filter((_, i) => i !== index));
    };

    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      onDrop: handleFileDrop,
      ...dropzoneOptions,
    });

    const dropZoneClassName = twMerge(
      variants.base,
      isFocused && variants.active,
      disabled && variants.disabled,
      (isDragReject ?? fileRejections[0]) && variants.reject,
      isDragAccept && variants.accept,
      className
    ).trim();

    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return `The file is too large. Max size is ${formatFileSize(
            dropzoneOptions?.maxSize ?? 0
          )}.`;
        } else if (errors[0]?.code === "file-invalid-type") {
          return "Invalid file type.";
        } else if (errors[0]?.code === "too-many-files") {
          return `You can only add ${dropzoneOptions?.maxFiles ?? 0} file(s).`;
        } else {
          return "The file is not supported.";
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div>
        <div className="flex flex-col gap-2">
          <div>
            <div
              {...getRootProps({
                className: dropZoneClassName,
              })}
            >
              <input ref={ref} {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-xs text-gray-400">
                <UploadCloudIcon className="mb-1 h-7 w-7" />
                <div className="text-gray-400">
                  Drag & drop or click to upload
                </div>
              </div>
            </div>

            <div className="mt-1 text-xs text-red-500">
              {customError ?? errorMessage}
            </div>
          </div>

          {value.map(({ file, progress }, i) => (
            <div
              key={i}
              className="flex h-16 w-96 max-w-[100vw] flex-col justify-center rounded border border-gray-300 px-4 py-2"
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-white">
                <FileIcon size="30" className="shrink-0" />
                <div className="min-w-0 text-sm">
                  <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <div className="grow" />
                <div className="flex w-12 justify-end text-xs">
                  <button
                    className="rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleDelete(i)}
                  >
                    <Trash2Icon className="shrink-0" />
                  </button>
                </div>
              </div>
              {typeof progress === "number" && (
                <div className="relative h-0">
                  <div className="absolute top-1 h-1 w-full overflow-clip rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-gray-400 transition-all duration-300 ease-in-out dark:bg-white"
                      style={{
                        width: progress ? `${progress}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button className="btn-primary" onClick={handleUpload}>
            Upload Files
          </button>
          <Spacer size={5}></Spacer>
        </div>
      </div>
    );
  }
);
MultiFileDropzone.displayName = "MultiFileDropzone";

function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "0 Bytes";
  }
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export { MultiFileDropzone };
