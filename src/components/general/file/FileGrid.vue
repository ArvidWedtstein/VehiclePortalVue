<script setup lang="ts">
import { formatDate } from '@/utils/date';
import { formatFileSize } from '@/utils/format';
import type { iFile } from './FileDrop.vue';

type Props = {
  files?: Partial<iFile>[];
};

withDefaults(defineProps<Props>(), {
  files: () => [],
});
</script>

<template>
  <div class="table w-full table-auto rounded-lg border border-zinc-500 border-opacity-70 p-2 text-left">
    <div class="table-header-group w-full text-xs text-black dark:text-zinc-300">
      <div class="table-cell p-1 max-w-3"></div>
      <div class="table-cell p-2 w-auto">Name</div>
      <div class="table-cell w-1/5 p-2">Size</div>
      <div class="hidden md:table-cell p-2">Last Modified</div>
      <div v-if="!!$slots.actions" class="table-cell p-2">Action</div>
    </div>

    <div class="table-row-group w-full" v-if="!files.length">
      <div class="table-cell max-w-3"></div>
      <div class="table-cell p-2 text-gray-400">No files uploaded yet</div>
      <div class="table-cell"></div>
      <div class="table-cell"></div>
      <div class="hidden md:table-cell"></div>
      <div v-if="!!$slots.actions" class="table-cell"></div>
    </div>
    <div v-for="(file, index) in files" class="table-row-group w-full text-xs text-black dark:text-white" :class="{
      'text-red-500': file.error,
    }" :key="`file-${index}`">
      <div class="table-cell max-w-3">
        <span :title="file.error?.message"
          class="truncate rounded p-1 text-center align-middle text-xs uppercase text-black dark:text-white"
          :class="[file.error ? 'bg-red-500' : 'bg-zinc-500']">
          <slot name="fileIcon" :file="file">
            <svg v-if="file.error || file.state === 'uploading'" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512" class="inline-block h-3 w-3 fill-current"
              :class="{ 'animate-spin': file.state === 'uploading' }">
              <path v-if="file.error"
                d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480zM256 304c8.844 0 16-7.156 16-16V128c0-8.844-7.156-16-16-16S240 119.2 240 128v160C240 296.8 247.2 304 256 304zM256 344c-13.25 0-24 10.75-24 24s10.75 24 24 24s24-10.75 24-24S269.3 344 256 344z" />
              <path v-else-if="file.state == 'uploading'"
                d="M271.3 32.52C262.8 31.94 256 25.22 256 16.68c0-9.296 7.964-16.72 17.24-16.11C406.4 9.47 512 120.6 512 256c0 40.08-9.393 77.95-25.92 111.7c-4.07 8.32-14.23 11.61-22.27 7.015c-7.108-4.062-10.37-13.09-6.757-20.43C471.7 324.6 480 291.3 480 256C480 137.6 387.7 40.41 271.3 32.52z" />
            </svg>
            <span v-else-if="file.state === 'newfile'" class="loading loading-spinner loading-xs"></span>
            <span v-else>{{ file.file?.name.split('.').pop() }}</span>
          </slot>
        </span>
      </div>
      <div class="table-cell w-auto sm:w-2/5 p-2">{{ file.file?.name }}</div>
      <div class="table-cell p-2">
        {{ formatFileSize(file.file?.size || 0) }}
      </div>
      <div class="hidden md:table-cell truncate p-2">
        {{
          formatDate(new Date(file.file?.lastModified || new Date()), {
            dateStyle: 'medium',
          })
        }}
      </div>
      <div v-if="!!$slots.actions" class="table-cell align-middle relative">
        <slot name="actions" :file="file"></slot>
      </div>
    </div>
  </div>
</template>
