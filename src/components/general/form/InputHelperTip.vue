<script setup lang="ts">
type Props = {
  tip: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  color?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
};

withDefaults(defineProps<Props>(), {
  position: 'right',
});
</script>

<template>
  <span
    class="label-text-alt tooltip"
    :class="{
      'tooltip-top': position === 'top',
      'tooltip-bottom': position === 'bottom',
      'tooltip-left': position === 'left',
      'tooltip-right': position === 'right',
      'tooltip-primary': color === 'primary',
      'tooltip-secondary': color === 'secondary',
      'tooltip-accent': color === 'accent',
      'tooltip-info': color === 'info',
      'tooltip-success': color === 'success',
      'tooltip-warning': color === 'warning',
      'tooltip-error': color === 'error',
    }"
    :data-tip="tip"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class="w-4 fill-current"
    >
      <path
        d="M256 336C238 336 224 350 224 368C224 386 238 400 256 400C274 400 288 386 288 368C288 350 274 336 256 336ZM290 128H238C199 128 168 159 168 198C168 211 179 222 192 222S216 211 216 198C216 186 226 176 238 176H290C302 176 312 186 312 198C312 206 308 213 301 217L244 251C236 256 232 264 232 272V288C232 301 243 312 256 312S280 301 280 288V286L326 258C347 245 360 222 360 198C360 159 329 128 290 128ZM256 16C123.451 16 16 123.451 16 256S123.451 496 256 496S496 388.549 496 256S388.549 16 256 16ZM256 448C150.131 448 64 361.869 64 256S150.131 64 256 64S448 150.131 448 256S361.869 448 256 448Z"
      />
    </svg>
  </span>
</template>
