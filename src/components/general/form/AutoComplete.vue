<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { debounce } from '@/utils/utils';

// Define component props
interface Props {
  label?: string;
  modelValue: string;
  options: string[];
  debounceDelay?: number;
}
const props = defineProps<Props>();

// Emit selected option to parent component
const emit = defineEmits<{
  (e: 'select', option: string): void;
  (e: 'update:modelValue', value: string): void;
}>();

// Reactive states
const inputValue = ref(props.modelValue);
const selectedIndex = ref(-1);
const isDropdownOpen = ref(false);
const filteredOptions = computed(() =>
  props.options.filter(option =>
    option.toLowerCase().includes(inputValue.value.toLowerCase()),
  ),
);
watch(
  () => props.modelValue,
  newValue => {
    inputValue.value = newValue;
  },
);

// Watch query and reset selectedIndex when query changes
watch(inputValue, () => {
  selectedIndex.value = -1;
});

const openDropdown = () => {
  isDropdownOpen.value = true;
};

// Define input handler, debounced if a delay is provided
const onInput = props.debounceDelay
  ? debounce(() => {
      openDropdown();
    }, props.debounceDelay)
  : () => {
      openDropdown();
    };

// Keyboard navigation for options
const onArrowDown = () => {
  if (selectedIndex.value < filteredOptions.value.length - 1) {
    selectedIndex.value++;
  }
};
const onArrowUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};
const onEnter = () => {
  if (
    selectedIndex.value >= 0 &&
    selectedIndex.value < filteredOptions.value.length
  ) {
    selectOption(filteredOptions.value[selectedIndex.value]);
  }
};

// Select an option, emit to parent, and close dropdown
const selectOption = (option: string) => {
  inputValue.value = option; // Set inputValue to the selected option
  emit('select', option); // Emit select event
  emit('update:modelValue', option); // Update modelValue
  isDropdownOpen.value = false; // Close dropdown
};

// Close dropdown when clicking outside
const autocompleteRef = ref<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
  if (!autocompleteRef.value) return;

  isDropdownOpen.value = autocompleteRef.value.contains(event.target as Node);
}

// Setup click outside event listener
onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener('mousedown', handleClickOutside),
);
</script>

<template>
  <div class="w-full max-w-xs relative" ref="autocompleteRef">
    <div class="dropdown" :class="{ 'dropdown-open': isDropdownOpen }">
      <label class="form-control mb-1">
        <slot name="label">
          <div class="label" v-show="label">
            <span class="label-text">{{ label }}</span>
          </div>
        </slot>

        <input
          type="text"
          class="input input-bordered w-full"
          v-model="inputValue"
          @input="onInput"
          @focus="openDropdown"
          @keydown.down.prevent="onArrowDown"
          @keydown.up.prevent="onArrowUp"
          @keydown.enter.prevent="onEnter"
          placeholder="Search..."
        />
      </label>
      <ul
        v-if="isDropdownOpen && filteredOptions.length && inputValue"
        class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li
          v-for="(option, index) in filteredOptions"
          :key="option"
          @click="selectOption(option)"
        >
          <a :class="{ 'bg-primary text-white': index === selectedIndex }">{{
            option
          }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
