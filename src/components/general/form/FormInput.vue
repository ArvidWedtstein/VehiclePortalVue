<script lang="ts" setup>
import { maskInput } from '@/lib/mask';
import { useSlots, computed, type InputTypeHTMLAttribute } from 'vue';

type Props = {
  wrapperClass?: string;
  class?: string;
  type?: InputTypeHTMLAttribute | 'select' | 'textarea';
  options?: Array<{ value: string | number; label?: string }>;
  label?: string;
  helpText?: string;
  join?: boolean;
  required?: boolean;
  mask?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?:
    | 'error'
    | 'warning'
    | 'success'
    | 'info'
    | 'accent'
    | 'primary'
    | 'secondary';
  inputmode?:
    | 'decimal'
    | 'numeric'
    | 'email'
    | 'none'
    | 'search'
    | 'tel'
    | 'text'
    | 'url';
};

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  wrapperClass: 'w-full',
  join: false,
  required: false,
});

const slots = useSlots();

const model = defineModel<string | number | null>();

const computedType = computed(() => {
  return props.type === 'select' ||
    props.type === 'textarea' ||
    props.type === 'range'
    ? (props.type as 'select' | 'textarea' | 'range')
    : 'input';
});

const computedClass = computed(() => {
  const baseClasses = {
    input: 'input input-bordered',
    textarea: 'textarea textarea-bordered',
    select: 'select select-bordered',
    range: 'range',
  };

  const invalidClasses = {
    input: 'invalid:input-error',
    textarea: 'invalid:textarea-error',
    select: 'invalid:select-error',
    range: 'invalid:range-error',
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
    md: `${computedType.value}-md`,
    lg: `${computedType.value}-lg`,
  };

  return [
    baseClasses[computedType.value],
    props.color && colorClasses[props.color],
    sizeClasses[props.size],
    props.join && 'join-item',
    !!slots.icon && 'pl-10',
    invalidClasses[computedType.value],
    // model.value &&
    //   model.value.toString().length > 0 &&
    //   invalidClasses[computedType.value],
    'grow',
    props.class,
  ];
});

const onInput = (event: Event) => {
  const rawValue = (event.target as HTMLInputElement)?.value;

  if (props.min !== undefined && parseInt(rawValue) < props.min) {
    model.value = props.min;
  }

  if (props.max !== undefined && parseInt(rawValue) > props.max) {
    model.value = props.max;
  }

  if (!props.mask) return;

  const masked = maskInput(rawValue, props.mask);

  model.value = masked;
};
</script>

<template>
  <label class="form-control" :class="wrapperClass">
    <slot name="label" :label="`${label}${required ? ' *' : ''}`">
      <div class="label" v-show="label">
        <span class="label-text">
          {{ label }}
          {{ required ? '*' : '' }}
        </span>
      </div>
    </slot>

    <label
      class="relative"
      :class="[join ? `join max-w-full` : 'flex items-center gap-2']"
    >
      <div
        v-if="$slots.icon"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <slot name="icon"></slot>
      </div>

      <slot name="input">
        <textarea
          v-if="type === 'textarea'"
          v-bind="$attrs"
          v-model="model"
          :class="computedClass"
          :inputmode="inputmode"
          :required="props.required"
          :placeholder="placeholder"
          @input="onInput"
        ></textarea>

        <select
          v-else-if="type === 'select'"
          v-bind="$attrs"
          v-model="model"
          :class="computedClass"
          :inputmode="inputmode"
          :required="props.required"
          :placeholder="placeholder"
          @input="onInput"
        >
          <option disabled value="" selected hidden>{{ placeholder }}</option>
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label ?? option.value }}
          </option>
        </select>

        <input
          v-else
          :type="type"
          v-bind="$attrs"
          v-model="model"
          :class="computedClass"
          :inputmode="inputmode"
          :required="props.required"
          :placeholder="placeholder"
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
