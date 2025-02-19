<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  /**
   * Source url.
   *
   * Supported formats: apng, avif, gif, jpeg, png, svg, webp
   */
  src?: string | null;
  fallbackSrc?: string;
  /**
   * Holds a textual replacement for the image,
   * which is mandatory and incredibly useful for accessibility — screen readers read the attribute value out to their users so they know what the image means.
   */
  alt?: string | null;

  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  /**
   * Shape of image.
   * @default 'circle'
   */
  shape?: 'rounded' | 'circle' | 'squircle' | 'hexagon' | 'triangle';

  loading?: boolean;
  imageLoading?: 'eager' | 'lazy';
};

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: props => (props.alt || 'Unknown') as string,
  size: 'md',

  shape: 'circle',

  loading: false,
  imageLoading: 'lazy',
});

const fallbackSrc = computed(() => {
  return props.fallbackSrc ?? `https://ui-avatars.com/api/?name=Unknown`;
});

const computedClasses = computed(() => {
  const sizeClasses = {
    xxs: 'size-5',
    xs: 'size-8',
    sm: 'size-10',
    md: 'size-12',
    lg: 'size-14',
  };

  const shapeClasses = {
    rounded: 'rounded',
    circle: 'rounded-full',
    squircle: 'mask mask-squircle',
    hexagon: 'mask mask-hexagon',
    triangle: 'mask mask-triangle',
  };

  return [
    sizeClasses[props.size],
    shapeClasses[props.shape],
    { skeleton: props.loading },
  ];
});

const handleError = (event: Event) => {
  const target = event.target as HTMLImageElement;

  target.onerror = null;

  target.src = fallbackSrc.value;
};
</script>

<template>
  <div class="avatar">
    <div class="text-neutral-content" :class="computedClasses">
      <img v-if="!loading" role="img" :src="src || ''" :alt="alt || ''" decoding="async" :loading="imageLoading"
        @error="handleError" />
    </div>
  </div>
</template>
