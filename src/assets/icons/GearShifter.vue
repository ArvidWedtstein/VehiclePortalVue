<script setup lang="ts">
type Props = {
  gears?: number;
};

withDefaults(defineProps<Props>(), {
  gears: 5,
});
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
    <g transform="translate(4,0) scale(0.01)">
      <path
        d="M160 64c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.8 1.6l-96 64C-.5 111.2-4.4 131 5.4 145.8s29.7 18.7 44.4 8.9L96 123.8V416H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H160V64z"
      />
    </g>
    <rect id="1" x="4" y="6" width="2" height="6" />

    <template v-if="gears > 2">
      <g :transform="`translate(${gears > 4 ? 11.5 : 20},0) scale(0.01)`">
        <path
          d="M0 64C0 46.3 14.3 32 32 32H272c13.2 0 25 8.1 29.8 20.4s1.5 26.3-8.2 35.2L162.3 208H184c75.1 0 136 60.9 136 136s-60.9 136-136 136H105.4C63 480 24.2 456 5.3 418.1l-1.9-3.8c-7.9-15.8-1.5-35 14.3-42.9s35-1.5 42.9 14.3l1.9 3.8c8.1 16.3 24.8 26.5 42.9 26.5H184c39.8 0 72-32.2 72-72s-32.2-72-72-72H80c-13.2 0-25-8.1-29.8-20.4s-1.5-26.3 8.2-35.2L189.7 96H32C14.3 96 0 81.7 0 64z"
        />
      </g>
      <rect id="3" :x="gears > 4 ? 12 : 20" y="6" width="2" height="6" />
    </template>

    <template v-if="gears > 4">
      <g transform="translate(20,0) scale(0.01)">
        <path
          d="M32.5 58.3C35.3 43.1 48.5 32 64 32H256c17.7 0 32 14.3 32 32s-14.3 32-32 32H90.7L70.3 208H184c75.1 0 136 60.9 136 136s-60.9 136-136 136H100.5c-39.4 0-75.4-22.3-93-57.5l-4.1-8.2c-7.9-15.8-1.5-35 14.3-42.9s35-1.5 42.9 14.3l4.1 8.2c6.8 13.6 20.6 22.1 35.8 22.1H184c39.8 0 72-32.2 72-72s-32.2-72-72-72H32c-9.5 0-18.5-4.2-24.6-11.5s-8.6-16.9-6.9-26.2l32-176z"
        />
      </g>
      <rect id="5" x="20" y="6" width="2" height="6" />
    </template>

    <rect x="4" y="11.5" width="18" height="2" />

    <template v-if="gears > 1">
      <g transform="translate(4,18) scale(0.01)">
        <path
          d="M142.9 96c-21.5 0-42.2 8.5-57.4 23.8L54.6 150.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L40.2 74.5C67.5 47.3 104.4 32 142.9 32C223 32 288 97 288 177.1c0 38.5-15.3 75.4-42.5 102.6L109.3 416H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9L200.2 234.5c15.2-15.2 23.8-35.9 23.8-57.4c0-44.8-36.3-81.1-81.1-81.1z"
        />
      </g>
      <rect id="2" x="4" y="12" width="2" height="6" />
    </template>

    <template v-if="gears > 3">
      <g :transform="`translate(${gears > 4 ? 11.5 : 20},18) scale(0.01)`">
        <path
          d="M189 77.6c7.5-16 .7-35.1-15.3-42.6s-35.1-.7-42.6 15.3L3 322.4c-4.7 9.9-3.9 21.5 1.9 30.8S21 368 32 368H256v80c0 17.7 14.3 32 32 32s32-14.3 32-32V368h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320V160c0-17.7-14.3-32-32-32s-32 14.3-32 32V304H82.4L189 77.6z"
        />
      </g>
      <rect id="4" :x="gears > 4 ? 12 : 20" y="12" width="2" height="6" />
    </template>

    <template v-if="gears > 5">
      <g transform="translate(20,18) scale(0.01)">
        <path
          d="M232.4 84.7c11.4-13.5 9.7-33.7-3.8-45.1s-33.7-9.7-45.1 3.8L38.6 214.7C14.7 242.9 1.1 278.4 .1 315.2c0 1.4-.1 2.9-.1 4.3c0 .2 0 .3 0 .5c0 88.4 71.6 160 160 160s160-71.6 160-160c0-85.5-67.1-155.4-151.5-159.8l63.9-75.6zM256 320A96 96 0 1 1 64 320a96 96 0 1 1 192 0z"
        />
      </g>
      <rect id="6" x="20" y="12" width="2" height="6" />
    </template>
  </svg>
</template>
