<script setup lang="ts">
import {
  convertBytes,
  formatFileSize,
  formatListDisjunction,
} from '@/utils/format';
import { supabase } from '@/lib/supabaseClient';
import FileGrid from '../file/FileGrid.vue';
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useToastStore } from '@/stores/toasts';
import MenuItem from '../menu/MenuItem.vue';

const FilePreviewModal = defineAsyncComponent(
  async () => await import('@/components/general/modal/FilePreviewModal.vue'),
);

// TODO: Exclude filegrid from filedrop
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
  accept?: ReadonlyArray<string>;
  /**
   * Max size in megabytes
   * @default 5 mb
   */
  maxSize?: number;
};

export type iFile = {
  file: {
    name: string;
    lastModified?: number;
    webkitRelativePath?: string;
    size?: number;
    type?: string;
  };
  preview?: boolean;
  state: 'newfile' | 'uploading' | 'uploaded';
  url?: string;
  path?: string;
  error?: {
    type: 'oversized' | 'invalidType' | 'uploadError' | 'invalidCharacters';
    message: string;
  };
};

const props = withDefaults(defineProps<FileUploadProps>(), {
  name: '',
  label: '',
  hideDropArea: false,
  hideFilesGrid: false,
  storagePath: '',
  accept: () => ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', '.pdf'],
  maxSize: 5,
  valueFormatter: (filename: string | null) => {
    return filename || '';
  },
  initialFiles: () => [],
});

const filePreviewRef = ref<InstanceType<typeof FilePreviewModal> | null>(null);

const files = ref<Partial<iFile>[]>([]);

const { addToast } = useToastStore();

const validateFile = (file: File) => {
  let fileError: iFile['error'] = undefined;

  if (file.size > convertBytes(props.maxSize, 'megabytes', 'bytes')) {
    fileError = {
      type: 'oversized',
      message: `File is too large.${` Max size is ${formatFileSize(convertBytes(props.maxSize, 'megabytes', 'bytes'))}.`}`,
    };
  }

  if (
    !props.accept
      .map(type =>
        type
          .substring(type.indexOf('/') + '/'.length)
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, ''),
      )
      .includes(
        file.type.substring(file.type.indexOf('/') + '/'.length).toUpperCase(),
      )
  ) {
    fileError = {
      type: 'invalidType',
      message: `Invalid file type.`,
    };
  }

  if (!/^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(file.name)) {
    fileError = {
      type: 'invalidCharacters',
      message: `File name contains invalid characters.`,
    };
  }

  return fileError;
};

const readFiles = (ifiles: FileList): void => {
  Array.prototype.forEach.call(ifiles, (file: File) => {
    const reader = new FileReader();

    reader.onloadend = fileloader => {
      if (!file.type || !fileloader.target?.result) {
        console.error('Invalid file type.');
        return;
      }

      const fileErrors = validateFile(file);

      const newFile: iFile = {
        file: file,
        url: fileloader.target.result.toString(),
        state: 'newfile',
        preview: false,
        error: fileErrors,
      };

      files.value = [...files.value, newFile];

      if (!fileErrors) {
        handleUpload();
      }
    };

    reader.readAsDataURL(file);
  });
};

const handleFileChange = (e: Event) => {
  return new Promise(() => {
    const inputElement = e.target as HTMLInputElement;

    if (!inputElement?.files || !inputElement?.files?.length) return;

    readFiles(inputElement.files);
  });
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();

  return new Promise(() => {
    const { dataTransfer } = e;

    if (!dataTransfer?.files.length) return;

    readFiles(dataTransfer.files);
  });
};

const handleUpload = () => {
  const filesToBeUploaded = files.value.filter(
    ({ error, state }) => state === 'newfile' && !error,
  );

  if (!filesToBeUploaded.length) return;

  filesToBeUploaded.forEach(async ({ file }) => {
    if (!file) return;

    files.value = files.value.map(f =>
      f.file?.name === file?.name
        ? {
            ...f,
            state: 'uploading',
          }
        : f,
    );

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
      f.file?.name === file?.name
        ? {
            ...f,
            path: data?.path,
            state: 'uploaded',
            error: hasError,
          }
        : f,
    );
  });
};

const handleFilePreview = (file: Partial<iFile>) => {
  filePreviewRef.value?.open({
    src: file.url,
    path: file.path,
  });
};

const handleFileDelete = async (file: Partial<iFile>) => {
  try {
    files.value = files.value.filter(({ path }) => path !== file.path);

    if (!file.path) return;

    // TODO: move into Documents store?
    // emit delete event instead

    const { error } = await supabase.storage
      .from(props.bucket)
      .remove([file.path]);

    if (error) {
      throw error;
    }

    addToast(`Successfully deleted file`, 'success', 2000);
  } catch (error) {
    console.error(error);
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

watch(
  () => props.initialFiles,
  () => {
    files.value = props.initialFiles.map(file => {
      return {
        ...file,
        error: undefined,
      };
    });

    console.log('filkes', files.value);
  },
);

onMounted(() => {
  files.value = props.initialFiles.map(file => {
    return {
      ...file,
      error: undefined,
    };
  });
});
</script>

<template>
  <div
    class="group relative flex flex-col gap-2 text-gray-900 transition-colors dark:text-stone-200"
    @dragover="onDragOver"
    @drop="handleDrop"
  >
    <FilePreviewModal ref="filePreviewRef" :bucket="bucket" />
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
                  accept.map(type =>
                    type
                      .substring(type.indexOf('/') + '/'.length)
                      .toUpperCase(),
                  ),
                )
              }}
            </span>

            <span v-if="maxSize">{{
              ` (Max. ${formatFileSize(convertBytes(maxSize, 'megabytes', 'bytes'))})`
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
          :accept="accept.join(', ')"
          :multiple="props.multiple"
          :size="convertBytes(maxSize, 'megabytes', 'bytes')"
          @change="handleFileChange"
          hidden
        />
      </label>
    </div>

    <slot :files="files">
      <FileGrid :files="files">
        <template #actions="{ file }">
          <div class="dropdown dropdown-end">
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
              class="dropdown-content menu menu-sm bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
            >
              <MenuItem @click="handleFilePreview(file)">Preview</MenuItem>
              <MenuItem @click="handleFileDelete(file)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  class="w-3 fill-current"
                >
                  <path
                    d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                  />
                </svg>
                Delete
              </MenuItem>
            </ul>
          </div>
        </template>
      </FileGrid>
    </slot>

    <button
      class="btn w-full btn-primary"
      @click="handleUpload"
      :disabled="
        !files.filter(({ state, error }) => state === 'newfile' && !error)
          .length
      "
    >
      Upload
    </button>
  </div>
</template>
