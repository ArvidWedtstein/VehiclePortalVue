<script lang="ts" setup>
import { maskInput } from '@/lib/mask';
import { computed, ref } from 'vue';
type Props = {
  wrapperClass?: string;
  class?: string;
  type?: HTMLInputElement['type'] | 'select' | 'textarea';
  label?: string;
  helpText?: string;
  icon?: string;
  join?: boolean;
  mask?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?:
    | 'error'
    | 'warning'
    | 'success'
    | 'info'
    | 'accent'
    | 'primary'
    | 'secondary';
};

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  join: false,
});

const model = defineModel<string | number>();

const computedType = computed(() => {
  return props.type === 'select' || props.type === 'textarea'
    ? props.type
    : 'input';
});

const computedClass = computed(() => [
  {
    'input input-bordered invalid:input-error': computedType.value === 'input',
    'select select-bordered invalid:select-error': computedType.value === 'select',
    'textarea textarea-bordered invalid:textarea-error': computedType.value === 'textarea',

    'input-primary': props.color == 'primary' && computedType.value === 'input',
    'input-secondary':
      props.color == 'secondary' && computedType.value === 'input',
    'input-error': props.color == 'error' && computedType.value === 'input',
    'input-warning': props.color == 'warning' && computedType.value === 'input',
    'input-success': props.color == 'success' && computedType.value === 'input',
    'input-accent': props.color == 'accent' && computedType.value === 'input',
    'input-info': props.color == 'info' && computedType.value === 'input',

    'textarea-primary':
      props.color == 'primary' && computedType.value === 'textarea',
    'textarea-secondary':
      props.color == 'secondary' && computedType.value === 'textarea',
    'textarea-error':
      props.color == 'error' && computedType.value === 'textarea',
    'textarea-warning':
      props.color == 'warning' && computedType.value === 'textarea',
    'textarea-success':
      props.color == 'success' && computedType.value === 'textarea',
    'textarea-accent':
      props.color == 'accent' && computedType.value === 'textarea',
    'textarea-info': props.color == 'info' && computedType.value === 'textarea',

    'select-primary':
      props.color == 'primary' && computedType.value === 'select',
    'select-secondary':
      props.color == 'secondary' && computedType.value === 'select',
    'select-error': props.color == 'error' && computedType.value === 'select',
    'select-warning':
      props.color == 'warning' && computedType.value === 'select',
    'select-success':
      props.color == 'success' && computedType.value === 'select',
    'select-accent': props.color == 'accent' && computedType.value === 'select',
    'select-info': props.color == 'info' && computedType.value === 'select',

    'input-xs': props.size === 'xs' && computedType.value === 'input',
    'input-sm': props.size === 'sm' && computedType.value === 'input',
    'input-lg': props.size === 'lg' && computedType.value === 'input',

    'textarea-xs': props.size === 'xs' && computedType.value === 'textarea',
    'textarea-sm': props.size === 'sm' && computedType.value === 'textarea',
    'textarea-lg': props.size === 'lg' && computedType.value === 'textarea',

    'select-xs': props.size === 'xs' && computedType.value === 'select',
    'select-sm': props.size === 'sm' && computedType.value === 'select',
    'select-lg': props.size === 'lg' && computedType.value === 'select',

    'join-item': props.join,
  },
  props.class,
]);

const onInput = (event: InputEvent) => {
  const rawValue = (event.target as HTMLInputElement)?.value;

  if (!props.mask) return;


  const masked = maskInput(rawValue, props.mask);
  console.log(rawValue, masked, model.value)
  model.value = masked;
}
</script>

<template>
  <label class="form-control w-full" :class="wrapperClass">
    <slot name="label">
      <div class="label" v-show="label">
        <span class="label-text">{{ label }}</span>
      </div>
    </slot>

    <label :class="[join ? `join` : 'flex items-center gap-2']">
      <slot name="icon">
        <i v-if="icon" :class="icon"></i>
      </slot>

      <slot name="input">
        <component
          :is="computedType"
          @input="onInput"
          class="grow"
          :class="computedClass"
          v-bind="$attrs"
          v-model="model"
          :value="model"
        >
          <slot></slot>
        </component>
      </slot>
      <slot name="addon"></slot>
    </label>
    <slot name="helpText">
      <div class="label" v-if="helpText">
        <span class="label-text-alt">{{ helpText }}</span>
      </div>
    </slot>
  </label>
</template>
