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
import { downloadBlob } from '@/utils/export';

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

const downloadFile = async (file: Partial<iFile>) => {
  try {
    if (!file.path) return;

    const { data, error } = await supabase.storage
      .from('VehicleDocuments')
      .download(file.path);

    if (error) throw error;

    downloadBlob(data, file.file?.name || 'file');
  } catch (error) {
    console.error(error);
    addToast(`Failed to download file`, 'error', 2000);
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
        <template #fileIcon="{ file }">
          <svg
            v-if="
              Object.entries(file).filter(
                ([key, value]) =>
                  key === 'service_log_id' &&
                  value !== null &&
                  value !== undefined,
              ).length
            "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="inline-block w-3 fill-current"
          >
            <path
              d="M507.496 117.119C504.496 104.994 495.121 95.369 482.996 91.994C470.871 88.743 457.871 92.119 448.997 100.994L390.372 159.62L357.872 154.244L352.497 121.869L411.247 63.118C419.997 54.243 423.497 41.243 420.122 29.243C416.747 17.117 406.997 7.742 394.872 4.617C341.747 -8.508 286.873 6.742 248.248 45.368C210.623 82.993 195.623 136.744 207.498 188.62L24 371.998C8.5 387.498 0 408.123 0 429.999S8.5 472.499 24 488S60.125 512 81.999 512C103.874 512 124.499 503.5 139.999 488L323.372 304.747C375.122 316.622 428.997 301.622 466.871 263.746C504.871 225.746 520.496 169.495 507.496 117.119ZM432.872 229.871C404.372 258.371 362.622 267.996 323.872 255.121L309.748 250.371L105.999 453.999C93.249 466.874 70.749 466.874 57.999 453.999C51.5 447.624 48 439.124 48 429.999C48 420.999 51.5 412.373 57.999 405.998L261.873 202.245L257.248 188.12C244.373 149.244 253.997 107.494 282.248 79.243C302.623 58.993 329.372 47.993 357.247 47.993H358.372L301.123 105.369L316.247 195.87L406.747 210.995L464.121 153.744C464.496 181.995 453.496 209.245 432.872 229.871ZM87.999 407.998C79.124 407.998 71.999 415.124 71.999 423.999C71.999 432.874 79.124 439.999 87.999 439.999S103.999 432.874 103.999 423.999C103.999 415.124 96.874 407.998 87.999 407.998Z"
            />
          </svg>
          <span v-else>{{ file.file?.name.split('.').pop() }}</span>
        </template>
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
              <MenuItem @click="handleFilePreview(file)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  class="w-3 fill-current"
                >
                  <path
                    d="M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z"
                  />
                </svg>
                Preview
              </MenuItem>
              <MenuItem @click="downloadFile(file)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="w-3 fill-current"
                >
                  <path
                    d="M448 304H394.5L346.5 352H448C456.822 352 464 359.178 464 368V448C464 456.822 456.822 464 448 464H64C55.178 464 48 456.822 48 448V368C48 359.178 55.178 352 64 352H165.5L117.5 304H64C28.654 304 0 332.654 0 368V448C0 483.346 28.654 512 64 512H448C483.348 512 512 483.346 512 448V368C512 332.654 483.348 304 448 304ZM432 408C432 394.744 421.254 384 408 384S384 394.744 384 408C384 421.254 394.746 432 408 432S432 421.254 432 408ZM239.031 368.969C243.719 373.656 249.844 376 256 376S268.281 373.656 272.969 368.969L408.969 232.969C418.344 223.594 418.344 208.406 408.969 199.031S384.406 189.656 375.031 199.031L280 294.062V24C280 10.75 269.25 0 256 0S232 10.75 232 24V294.062L136.969 199.031C127.594 189.656 112.406 189.656 103.031 199.031S93.656 223.594 103.031 232.969L239.031 368.969Z"
                  />
                </svg>
                Download
              </MenuItem>
              <MenuItem @click="handleFileDelete(file)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  class="w-3 fill-current"
                >
                  <path
                    d="M424 80H349.625L315.625 23.25C306.875 8.875 291.25 0 274.375 0H173.625C156.75 0 141.125 8.875 132.375 23.25L98.375 80H24C10.745 80 0 90.745 0 104V104C0 117.255 10.745 128 24 128H32L53.25 467C54.75 492.25 75.75 512 101.125 512H346.875C372.25 512 393.25 492.25 394.75 467L416 128H424C437.255 128 448 117.255 448 104V104C448 90.745 437.255 80 424 80ZM173.625 48H274.375L293.625 80H154.375L173.625 48ZM346.875 464H101.125L80.125 128H367.875L346.875 464Z"
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
