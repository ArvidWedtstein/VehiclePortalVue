<script lang="ts" setup>
import { maskInput } from '@/lib/mask';
import { computed } from 'vue';
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

const model = defineModel<string | number | null>();

const computedType = computed(() => {
  return props.type === 'select' || props.type === 'textarea'
    ? props.type
    : 'input';
});

const computedClass = computed(() => {
  const baseClasses = {
    input: 'input input-bordered invalid:input-error',
    textarea: 'textarea textarea-bordered invalid:textarea-error',
    select: 'select select-bordered invalid:select-error',
  };

  // Color classes based on the component type
  const colorClasses = {
    primary: `${computedType.value}-primary`,
    secondary: `${computedType.value}-secondary`,
    error: `${computedType.value}-error`,
    warning: `${computedType.value}-warning`,
    success: `${computedType.value}-success`,
    accent: `${computedType.value}-accent`,
    info: `${computedType.value}-info`,
  };

  // Size classes based on the component type
  const sizeClasses = {
    xs: `${computedType.value}-xs`,
    sm: `${computedType.value}-sm`,
    md: '',
    lg: `${computedType.value}-lg`,
  };

  const colorClass = props.color  
    ? colorClasses[props.color]
    : '';

  return [
    baseClasses[computedType.value],
    colorClass,
    sizeClasses[props.size],
    props.join && 'join-item',
    'grow',
    props.class,
  ];
});

const onInput = (event: Event) => {
  const rawValue = (event.target as HTMLInputElement)?.value;

  if (!props.mask) return;


  const masked = maskInput(rawValue, props.mask);
  // console.log(rawValue, masked, model.value)
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
        <!-- <component
          :is="computedType"
          @input="onInput"
          class="grow"
          :class="computedClass"
          v-bind="$attrs"
          v-model="model"
          :value="model"
        >
          <slot></slot>
        </component> -->
        <textarea
          v-if="type === 'textarea'"
          v-bind="$attrs"
          v-model="model"
          :class="computedClass"
          @input="onInput"
        ></textarea>

        <select
          v-else-if="type === 'select'"
          v-bind="$attrs"
          :class="computedClass"
          v-model="model"
          @input="onInput"
        >
          <slot></slot>
        </select>

        <input
          v-else
          :type="type"
          v-bind="$attrs"
          :class="computedClass"
          v-model="model"
          @input="onInput"
        />
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
