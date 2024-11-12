<script setup lang="ts">
import { ref } from 'vue';
import { formatFileSize } from '@/utils/utils';
import { supabase } from '@/lib/supabaseClient';

type FileUploadProps = {
  variant?: 'standard' | 'outlined' | 'contained';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
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
  label?: string;
  multiple?: boolean;
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
    lastModified: number;
    webkitRelativePath: string;
    size: number;
    type: string;
  };
  [key: string]: unknown;
  preview: boolean;
  state: 'newfile' | 'uploading' | 'uploaded' | 'newuploaded';
  url: string;
  error?: {
    type: 'oversized' | 'invalidType' | 'uploadError';
    message: string;
  };
};

const props = withDefaults(defineProps<FileUploadProps>(), {
  storagePath: '',
  accept: 'image/png, image/jpg, image/jpeg, image/webp',
  maxSize: 5000,
  valueFormatter: (filename: string | null) => {
    return filename || '';
  },
  name: '',
  label: '',
});
// const files = ref<File[]>([]);
const files = ref<iFile[]>([]);

const imageUrlToFile = async (imageUrl: string, fileName: string) => {
  try {
    return await fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        return new File([blob], fileName, { type: blob.type });
      });
  } catch (error) {
    console.error('Error converting image URL to File:', error);
    return null;
  }
};

const readFiles = (ifiles: FileList): void => {
  Array.prototype.forEach.call(ifiles, (file: File) => {
    const reader = new FileReader();

    // onFileAdded?.(file);
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
        f.file.name === file.name
          ? {
              ...f,
              state: 'uploading',
            }
          : f,
      );

      const { error } = await supabase.storage
        .from(`${props.storagePath}`)
        .upload(props.valueFormatter(file.name, true), file as File)
        .finally(() => {
          files.value = files.value.map(f =>
            f.file.name === file.name
              ? {
                  ...f,
                  state: 'newuploaded',
                }
              : f,
          );
        });

      if (error) {
        files.value = files.value.map(f =>
          f.file.name === file.name
            ? {
                ...f,
                error: {
                  type: 'uploadError',
                  message: error.message,
                },
              }
            : f,
        );

        console.error(error.message);
      }
      // onUpload?.(file.name);
    });
};

const handleFileDelete = async (file: iFile) => {
  // let { error } =
  //   file.state == "uploaded" || file.state == "newuploaded"
  //     ? await supabase.storage.from(`${storagePath}`).remove([file.file.name])
  //     : { error: null };
  const error = false;
  if (error) {
    // toast.error(error.message);
  } else {
    files.value = files.value.filter(f => f.url !== file.url);
  }
};
const classes = {
  standard: {
    primary: 'border-b border-primary-400 border-opacity-50',
    secondary: 'border-b border-zinc-400 border-opacity-50',
    success: 'border-b border-success-500 border-opacity-50',
    warning: 'border-b border-warning-400 border-opacity-50',
    error: 'border-b border-error-500 border-opacity-50',
    default:
      'border-b dark:border-white border-black dark:border-opacity-50 border-opacity-50',
  },
  outlined: {
    primary: 'border border-primary-400 border-opacity-50',
    secondary: 'border border-zinc-400 border-opacity-50',
    success: 'border border-success-500 border-opacity-50',
    warning: 'border border-warning-400 border-opacity-50',
    error: 'border border-error-500 border-opacity-50',
    default:
      'border dark:border-white border-black dark:border-opacity-50 border-opacity-50',
  },
  contained: {
    primary: '',
    secondary: '',
    success: '',
    warning: '',
    error: '',
    default: '',
  },
};
</script>

<template>
  <div
    class="group relative flex w-[calc(100%-3rem)] max-w-2xl flex-col gap-2 text-gray-900 transition-colors dark:text-stone-200"
  >
    <div class="flex w-full items-center justify-center">
      <label
        for="dropzone-files"
        @dragover="($event: DragEvent) => $event.preventDefault()"
        @drop="handleDrop"
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
                new Intl.ListFormat('en-GB', {
                  style: 'long',
                  type: 'disjunction',
                }).format(
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
    <div
      class="table w-full table-auto rounded-lg border border-zinc-500 border-opacity-70 p-2 text-left"
    >
      <div
        class="table-header-group w-full text-xs text-black dark:text-zinc-300"
      >
        <div class="table-cell p-1"></div>
        <div class="table-cell p-2">Name</div>
        <div class="table-cell w-1/5 p-2">Size</div>
        <div class="table-cell p-2">Last Modified</div>
        <div class="table-cell p-2">Action</div>
      </div>
      <div
        v-for="(file, index) in files"
        class="table-row-group w-full text-xs text-black dark:text-white"
        :class="{
          'text-red-500': file.error,
        }"
        :key="`file-${index}`"
      >
        <div class="table-cell">
          <span
            class="truncate rounded p-1 text-center align-middle text-xs uppercase text-black dark:text-white"
            :class="[file.error ? 'bg-red-500' : 'bg-zinc-500']"
          >
            <svg
              v-if="file.error"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="inline-block h-3 w-3 fill-current"
            >
              <path
                d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480zM256 304c8.844 0 16-7.156 16-16V128c0-8.844-7.156-16-16-16S240 119.2 240 128v160C240 296.8 247.2 304 256 304zM256 344c-13.25 0-24 10.75-24 24s10.75 24 24 24s24-10.75 24-24S269.3 344 256 344z"
              />
            </svg>
            <svg
              v-else-if="file.state == 'uploading'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              class="inline h-3 w-3 animate-spin"
            >
              <path
                d="M271.3 32.52C262.8 31.94 256 25.22 256 16.68c0-9.296 7.964-16.72 17.24-16.11C406.4 9.47 512 120.6 512 256c0 40.08-9.393 77.95-25.92 111.7c-4.07 8.32-14.23 11.61-22.27 7.015c-7.108-4.062-10.37-13.09-6.757-20.43C471.7 324.6 480 291.3 480 256C480 137.6 387.7 40.41 271.3 32.52z"
              />
            </svg>
            <svg
              v-else-if="file.state === 'newuploaded'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              class="inline h-3 w-3"
            >
              <path
                d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z"
              />
            </svg>

            <span v-else>{{ file.file.name.split('.').pop() }}</span>
          </span>
        </div>
        <div class="table-cell w-2/5 p-2">{{ file.file.name }}</div>
        <div class="table-cell p-2">
          {{ formatFileSize(file.file.size) }}
        </div>
        <div class="table-cell truncate p-2">
          {{ new Date(file.file.lastModified).toDateString() }}
        </div>
        <div class="table-cell align-middle relative">
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-sm btn-ghost m-1">
              <svg
                class="w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="currentColor"
              >
                <path
                  d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z"
                />
              </svg>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <button
                  type="button"
                  @click="
                    $event => {
                      files = files.map(f => ({
                        ...f,
                        preview: f.file.name === file?.file?.name,
                      }));
                    }
                  "
                >
                  Preview
                </button>
              </li>
              <li><button @click="handleFileDelete(file)">Delete</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

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
      color="success"
      @click="handleUpload"
      :disabled="!files.filter(({ state }) => state === 'newfile').length"
    >
      Upload
    </button>
  </div>
</template>
