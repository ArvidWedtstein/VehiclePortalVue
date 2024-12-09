<script setup lang="ts">
import { formatFileSize, formatListDisjunction } from '@/utils/format';
import { supabase } from '@/lib/supabaseClient';
import FileGrid from '../file/FileGrid.vue';
import { ref, watch } from 'vue';
import { toast } from '@/lib/toastManager';

type FileUploadProps = {
  hideDropArea?: boolean;
  hideFilesGrid?: boolean;

  onUpload?: (url: string) => void;
  onFileAdded?: (file: File) => void;
  /**
   * Used for altering value in forms or before upload
   * @param filename
   * @param isUpload
   * @returns
   */
  valueFormatter?: (filename: string | null, isUpload: boolean) => string;
  className?: string;
  initialFiles?: Partial<iFile>[];
  label?: string;
  multiple?: boolean;
  /**
   * Bucket to get files from
   */
  bucket: string;
  storagePath?: string;
  sizeLimit?: number;
  /**
   * Name of the input field
   */
  name?: string;
  /**
   * Comma seperated list of mime file types
   */
  accept?: string;
  /**
   * Max size in bytes
   */
  maxSize?: number;
};
type iFile = {
  file: {
    name: string;
    lastModified?: number;
    webkitRelativePath?: string;
    size?: number;
    type?: string;
  };
  preview?: boolean;
  state: 'newfile' | 'uploading' | 'uploaded' | 'newuploaded';
  url?: string;
  path: string;
  error?: {
    type: 'oversized' | 'invalidType' | 'uploadError';
    message: string;
  };
};

const props = withDefaults(defineProps<FileUploadProps>(), {
  name: '',
  label: '',
  hideDropArea: false,
  hideFilesGrid: false,
  storagePath: '',
  accept: 'image/png, image/jpg, image/jpeg, image/webp',
  maxSize: 3150000,
  valueFormatter: (filename: string | null) => {
    return filename || '';
  },
  initialFiles: () => [],
});

const files = ref<Partial<iFile>[]>([]);

const readFiles = (ifiles: FileList): void => {
  Array.prototype.forEach.call(ifiles, (file: File) => {
    const reader = new FileReader();

    reader.onloadend = fileloader => {
      if (!file.type || !fileloader.target?.result) {
        console.error('Invalid file type.');
        return;
      }

      files.value.push({
        file: file,
        url: fileloader.target.result.toString(),
        state: 'newfile',
        preview: false,
        error:
          props.maxSize && file.size > props.maxSize
            ? {
                type: 'oversized',
                message: `File is too large.${` Max size is ${formatFileSize(props.maxSize)}.`}`,
              }
            : !props.accept
                  .split(',')
                  .map(a => a.trim().toUpperCase())
                  .includes(file.type.toUpperCase())
              ? {
                  type: 'invalidType',
                  message: `Invalid file type.`,
                }
              : undefined,
      });
    };

    reader.readAsDataURL(file);
  });
};

const handleFileChange = (e: Event) => {
  return new Promise(() => {
    const inputElement = e.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      readFiles(inputElement.files);
    }
  });
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();

  return new Promise(() => {
    const { dataTransfer } = e;
    if (dataTransfer?.files.length) {
      readFiles(dataTransfer.files);
    }
  });
};

const handleUpload = () => {
  files.value
    .filter(f => f.error == null && f.state === 'newfile')
    .forEach(async ({ file }) => {
      files.value = files.value.map(f =>
        f.file?.name === file?.name || ''
          ? {
              ...f,
              state: 'uploading',
            }
          : f,
      );

      // TODO: consider moving this to store?

      const { data, error } = await supabase.storage
        .from(props.bucket)
        .upload(
          `${props.storagePath}${props.valueFormatter(file?.name || '', true)}`,
          file as File,
        );

      let hasError: iFile['error'] = undefined;

      if (error) {
        hasError = {
          type: 'uploadError',
          message: error.message,
        };

        console.error(error.message);
      }

      files.value = files.value.map(f =>
        f.file?.name === (file?.name || '')
          ? {
              ...f,
              path: data?.path,
              state: 'newuploaded',
              error: hasError,
            }
          : f,
      );
    });
};

const fetchFiles = async () => {
  try {
    if (!props.initialFiles.length) return;

    const { data, error } = await supabase.storage
      .from(props.bucket)
      .createSignedUrls(
        props.initialFiles.map(({ path }) => path || ''),
        7200,
      );

    if (error) {
      throw error;
    }

    files.value = props.initialFiles.map(file => {
      const url = data.find(({ path }) => path === file.path);

      return {
        ...file,
        url: url?.signedUrl || '',
        error: undefined,
      };
    });
  } catch (error) {
    console.error(error);
  }
};

const handleFileDelete = async (file: Partial<iFile>) => {
  try {
    if (!file.path) return;

    const { error } = await supabase.storage
      .from(props.bucket)
      .remove([file.path || '']);

    if (error) {
      throw error;
    }

    files.value = files.value.filter(({ path }) => path !== file.path);

    toast.triggerToast(`Successfully deleted file`, 'success', 2000);
  } catch (error) {
    console.error(error);
  }
};

watch(
  () => props.initialFiles,
  () => {
    fetchFiles();
  },
);
</script>

<template>
  <div
    class="group relative flex flex-col gap-2 text-gray-900 transition-colors dark:text-stone-200"
    @dragover="($event: DragEvent) => $event.preventDefault()"
    @drop="handleDrop"
  >
    <div class="flex w-full items-center justify-center" v-if="!hideDropArea">
      <label
        for="dropzone-files"
        class="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed hover:border-opacity-100 dark:border-white border-black dark:border-opacity-50 border-opacity-5 transition-colors dark:hover:bg-zinc-700/20"
      >
        <div
          class="flex flex-col items-center justify-center pt-5 pb-6 will-change-contents"
        >
          <svg
            class="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>

          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold">Click to upload {{ label }}</span> or
            drag and drop
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            <span v-if="accept">
              {{
                formatListDisjunction(
                  accept
                    .split(',')
                    .map(type => type.trim().split('/')[1].toUpperCase()),
                )
              }}
            </span>

            <span v-if="maxSize">{{
              ` (Max. ${formatFileSize(maxSize)})`
            }}</span>
          </p>

          <p
            v-if="files.some(f => f.error)"
            class="mt-0.5 text-left text-xs leading-6 tracking-wide text-black/60 dark:text-white/70 -mb-2 text-red-500"
          >
            Invalid files will not be uploaded
          </p>
        </div>
        <input
          ref="inputRef"
          id="dropzone-files"
          type="file"
          class="hidden"
          :accept="accept"
          :multiple="props.multiple"
          :size="maxSize"
          @change="handleFileChange"
          hidden
        />
      </label>
    </div>

    <FileGrid
      v-if="!hideFilesGrid"
      :files="files"
      @previewFile="
        file => {
          files = files.map(f => ({
            ...f,
            preview: f.file?.name === file?.file?.name,
          }));
        }
      "
      @deleteFile="handleFileDelete"
    />

    <div
      v-if="files.some(p => p.preview)"
      class="animate-fade-in relative rounded-lg border border-zinc-500 p-2"
    >
      <button
        class="!absolute top-1 right-1 btn btn-sm btn-error btn-square btn-ghost"
        @click="
          $event => {
            files = files.map(f => ({
              ...f,
              preview: false,
            }));
          }
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          class="w-5"
          fill="currentColor"
        >
          <path
            d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z"
          />
        </svg>
        <span class="sr-only">Close</span>
      </button>

      <img
        :src="files.find(f => f.preview)?.url"
        class="aspect-square w-max max-w-full object-cover rounded"
      />
    </div>

    <button
      class="btn w-full btn-primary"
      @click="handleUpload"
      :disabled="!files.filter(({ state }) => state === 'newfile').length"
    >
      Upload
    </button>
  </div>
</template>
