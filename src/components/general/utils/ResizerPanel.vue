<template>
  <div :class="containerClass">
    <div class="overflow-auto" :style="panelStyles.first">
      <slot :name="mode === 'horizontal' ? 'left' : 'top'"></slot>
    </div>
    <div
      :class="resizerClass"
      @mousedown="startResize"
      @touchstart="startResize"
    ></div>
    <div class="overflow-auto" :style="panelStyles.second">
      <slot :name="mode === 'horizontal' ? 'right' : 'bottom'"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  type PropType,
  onMounted,
} from 'vue';

export default defineComponent({
  name: 'ResizerPanel',
  props: {
    mode: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
    minSize: {
      type: Number,
      default: 10, // percentage
    },
    maxSize: {
      type: Number,
      default: 90, // percentage
    },
    localStorageKey: {
      type: String,
      default: 'resizer-panel-size',
    },
  },
  setup(props) {
    const state = reactive({
      isResizing: false,
      initialPosition: 0,
      firstPanelSize: 50, // percentage
    });

    const containerClass = computed(() => {
      return props.mode === 'horizontal'
        ? 'flex h-full w-full overflow-x-hidden'
        : 'flex flex-col h-full w-full';
    });

    const resizerClass = computed(() => {
      return props.mode === 'horizontal'
        ? 'divider divider-horizontal cursor-col-resize'
        : 'divider divider-vertical cursor-row-resize';
    });

    const panelStyles = computed(() => {
      return props.mode === 'horizontal'
        ? {
            first: { flex: `0 0 ${state.firstPanelSize}%` },
            second: { flex: `0 0 ${100 - state.firstPanelSize}%` },
          }
        : {
            first: { height: `${state.firstPanelSize}%`, width: '100%' },
            second: { height: `${100 - state.firstPanelSize}%`, width: '100%' },
          };
    });

    const savePanelSize = () => {
      localStorage.setItem(
        props.localStorageKey,
        state.firstPanelSize.toString(),
      );
    };

    const loadPanelSize = () => {
      const savedSize = localStorage.getItem(props.localStorageKey);
      if (savedSize) {
        const parsedSize = parseFloat(savedSize);
        if (
          !isNaN(parsedSize) &&
          parsedSize >= props.minSize &&
          parsedSize <= props.maxSize
        ) {
          state.firstPanelSize = parsedSize;
        }
      }
    };

    const startResize = (event: MouseEvent | TouchEvent) => {
      state.isResizing = true;
      state.initialPosition =
        props.mode === 'horizontal'
          ? 'touches' in event
            ? event.touches[0].clientX
            : event.clientX
          : 'touches' in event
            ? event.touches[0].clientY
            : event.clientY;

      document.addEventListener('mousemove', onResize);
      document.addEventListener('mouseup', stopResize);
      document.addEventListener('touchmove', onResize);
      document.addEventListener('touchend', stopResize);
    };

    const onResize = (event: MouseEvent | TouchEvent) => {
      if (!state.isResizing) return;

      const currentPosition =
        props.mode === 'horizontal'
          ? 'touches' in event
            ? event.touches[0].clientX
            : event.clientX
          : 'touches' in event
            ? event.touches[0].clientY
            : event.clientY;

      const delta = currentPosition - state.initialPosition;
      const containerSize =
        props.mode === 'horizontal'
          ? document.body.clientWidth
          : document.body.clientHeight;

      const newFirstSize =
        (((state.firstPanelSize * containerSize) / 100 + delta) /
          containerSize) *
        100;

      if (newFirstSize >= props.minSize && newFirstSize <= props.maxSize) {
        state.firstPanelSize = newFirstSize;
        state.initialPosition = currentPosition;
        savePanelSize();
      }
    };

    const stopResize = () => {
      state.isResizing = false;

      document.removeEventListener('mousemove', onResize);
      document.removeEventListener('mouseup', stopResize);
      document.removeEventListener('touchmove', onResize);
      document.removeEventListener('touchend', stopResize);
    };

    onMounted(() => {
      loadPanelSize();
    });

    return { containerClass, resizerClass, panelStyles, startResize };
  },
});
</script>
