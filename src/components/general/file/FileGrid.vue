<script setup lang="ts">
import BindFileToServiceModal from '@/components/vehicles/services/BindFileToServiceModal.vue';
import { formatDate } from '@/utils/date';
import { formatFileSize } from '@/utils/format';
import { ref } from 'vue';
import type { iFile } from './FileDrop.vue';

type Props = {
  files?: Partial<iFile>[];
};

withDefaults(defineProps<Props>(), {
  files: () => [],
});

const emit = defineEmits<{
  (e: 'previewFile', file: Partial<iFile>): void;
  (e: 'deleteFile', file: Partial<iFile>): void;
}>();

const bindFileToServiceModalRef = ref();

const handleFileDelete = async (file: Partial<iFile>) => {
  emit('deleteFile', file);
};
</script>

<template>
  <BindFileToServiceModal ref="bindFileToServiceModalRef" />
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

    <div class="table-row-group w-full" v-if="!files.length">
      <div class="table-cell"></div>
      <div class="table-cell p-2 text-gray-400">No files uploaded yet</div>
      <div class="table-cell"></div>
      <div class="table-cell"></div>
      <div class="table-cell"></div>
      <div class="table-cell"></div>
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
          :title="file.error?.message"
          class="truncate rounded p-1 text-center align-middle text-xs uppercase text-black dark:text-white"
          :class="[file.error ? 'bg-red-500' : 'bg-zinc-500']"
        >
          <svg
            v-if="
              file.error ||
              file.state === 'uploading' ||
              file.state === 'newuploaded'
            "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="inline-block h-3 w-3 fill-current"
            :class="{ 'animate-spin': file.state === 'uploading' }"
          >
            <path
              v-if="file.error"
              d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480zM256 304c8.844 0 16-7.156 16-16V128c0-8.844-7.156-16-16-16S240 119.2 240 128v160C240 296.8 247.2 304 256 304zM256 344c-13.25 0-24 10.75-24 24s10.75 24 24 24s24-10.75 24-24S269.3 344 256 344z"
            />
            <path
              v-else-if="file.state === 'newuploaded'"
              d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z"
            />
            <path
              v-else-if="file.state == 'uploading'"
              d="M271.3 32.52C262.8 31.94 256 25.22 256 16.68c0-9.296 7.964-16.72 17.24-16.11C406.4 9.47 512 120.6 512 256c0 40.08-9.393 77.95-25.92 111.7c-4.07 8.32-14.23 11.61-22.27 7.015c-7.108-4.062-10.37-13.09-6.757-20.43C471.7 324.6 480 291.3 480 256C480 137.6 387.7 40.41 271.3 32.52z"
            />
          </svg>
          <span
            v-else-if="file.state === 'newfile'"
            class="loading loading-spinner loading-xs"
          ></span>
          <span v-else>{{ file.file?.name.split('.').pop() }}</span>
        </span>
      </div>
      <div class="table-cell w-2/5 p-2">{{ file.file?.name }}</div>
      <div class="table-cell p-2">
        {{ formatFileSize(file.file?.size || 0) }}
      </div>
      <div class="table-cell truncate p-2">
        {{
          formatDate(new Date(file.file?.lastModified || new Date()), {
            dateStyle: 'medium',
          })
        }}
      </div>
      <div class="table-cell align-middle relative">
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
            class="dropdown-content menu menu-sm bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <button type="button" @click="emit('previewFile', file)">
                Preview
              </button>
            </li>
            <li>
              <button
                type="button"
                @click="bindFileToServiceModalRef.open(file)"
              >
                Bind to service
              </button>
            </li>
            <li>
              <button type="button" @click="handleFileDelete(file)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  class="h-3 w-3 fill-current"
                >
                  <path
                    d="M432 80H349.625L315.625 23.25C306.984 8.827 291.405 0 274.592 0H173.408C156.595 0 141.016 8.827 132.375 23.25L98.375 80H16C7.125 80 0 87.125 0 96V112C0 120.875 7.125 128 16 128H32V448C32 483.346 60.654 512 96 512H352C387.346 512 416 483.346 416 448V128H432C440.875 128 448 120.875 448 112V96C448 87.125 440.875 80 432 80ZM171.875 50.875C172.875 49.125 174.875 48 177 48H271C273.125 48 275.125 49.125 276.125 50.875L293.625 80H154.375L171.875 50.875ZM352 464H96C87.163 464 80 456.837 80 448V128H368V448C368 456.837 360.837 464 352 464ZM224 416C232.844 416 240 408.844 240 400V192C240 183.156 232.844 176 224 176S208 183.156 208 192V400C208 408.844 215.156 416 224 416ZM144 416C152.844 416 160 408.844 160 400V192C160 183.156 152.844 176 144 176S128 183.156 128 192V400C128 408.844 135.156 416 144 416ZM304 416C312.844 416 320 408.844 320 400V192C320 183.156 312.844 176 304 176S288 183.156 288 192V400C288 408.844 295.156 416 304 416Z"
                  />
                </svg>
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
