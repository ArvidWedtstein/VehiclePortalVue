<script setup lang="ts">
import { toast } from '@/lib/toastManager';
const date = new Date();
</script>

<template>
  <div
    class="mt-10 text-center lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9"
  >
    <div class="flex items-center text-black">
      <button
        type="button"
        class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-stone-500 bms"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
          class="w-5 h-5"
        >
          <path
            fill-rule="evenodd"
            d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
      <div class="flex-auto font-semibold text-sm text-white">
        {{ date.toLocaleString('en-GB', { month: 'long' }) }}
      </div>
      <button
        type="button"
        class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-stone-500 bms"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
          class="w-5 h-5"
        >
          <path
            fill-rule="evenodd"
            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
    <div class="mt-6 grid grid-cols-7 text-xs">
      <div>M</div>
      <div>T</div>
      <div>W</div>
      <div>T</div>
      <div>F</div>
      <div>S</div>
      <div>S</div>
    </div>
    <div
      class="isolate mt-2 grid grid-cols-7 rounded-lg bg-gray-300 text-sm ring-1 ring-zinc-500 gap-px"
    >
      <button
        type="button"
        class="py-1.5 bjx boc bg-gray-300 text-stone-500 rounded-tl-lg"
        @click="toast.triggerToast('Operation successful!')"
      >
        <time
          datetime="2021-12-27"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >27</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-gray-300 text-stone-500">
        <time
          datetime="2021-12-28"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >28</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-gray-300 text-stone-500">
        <time
          datetime="2021-12-29"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >29</time
        ></button
      ><button
        type="button"
        class="py-1.5 bjx boc bg-gray-300 bg-gr text-stone-500"
      >
        <time
          datetime="2021-12-30"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >30</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-gray-300 text-stone-500">
        <time
          datetime="2021-12-31"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >31</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-01"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >1</time
        ></button
      ><button
        type="button"
        class="py-1.5 bjx boc bg-white text-black rounded-tr-lg"
      >
        <time
          datetime="2022-01-02"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >2</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-03"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >3</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-04"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >4</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-05"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >5</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-06"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >6</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-07"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >7</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-08"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >8</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-09"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >9</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-10"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >10</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-11"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >11</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-purple-700">
        <time
          datetime="2022-01-12"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full font-semibold"
          >12</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-13"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >13</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-14"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >14</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-15"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >15</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-16"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >16</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-17"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >17</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-18"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >18</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-19"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >19</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-20"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >20</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-21"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >21</time
        ></button
      ><button
        type="button"
        class="py-1.5 bjx boc bg-white font-semibold text-white"
      >
        <time
          datetime="2022-01-22"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-black"
          >22</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-23"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >23</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-24"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >24</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-25"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >25</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-26"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >26</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-27"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >27</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-28"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >28</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-29"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >29</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-white text-black">
        <time
          datetime="2022-01-30"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >30</time
        ></button
      ><button
        type="button"
        class="py-1.5 bjx boc bg-white text-black rounded-bl-lg"
      >
        <time
          datetime="2022-01-31"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >31</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-gray-300 text-stone-500">
        <time
          datetime="2022-02-01"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >1</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-gray-300 text-stone-500">
        <time
          datetime="2022-02-02"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >2</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-gray-300 text-stone-500">
        <time
          datetime="2022-02-03"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >3</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-gray-300 text-stone-500">
        <time
          datetime="2022-02-04"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >4</time
        ></button
      ><button type="button" class="py-1.5 bjx boc bg-gray-300 text-stone-500">
        <time
          datetime="2022-02-05"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >5</time
        ></button
      ><button
        type="button"
        class="py-1.5 bjx boc bg-gray-300 text-stone-500 rounded-br-lg"
      >
        <time
          datetime="2022-02-06"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
          >6</time
        >
      </button>
    </div>
  </div>
</template>
