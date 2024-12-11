<script setup lang="ts">
import { ref, nextTick, reactive, onMounted } from 'vue';

const fileInput = ref<HTMLInputElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const image = ref<HTMLImageElement>(new Image());
const imageLoaded = ref(false);
const cropOverlayVisible = ref(false);
const originalImageData = ref<ImageData | null>(null);

let rotation = 0;
const cropRegion = reactive({ x: 0, y: 0, width: 200, height: 200 });
let isDragging = false;
let isResizing = false;
let dragStart = { x: 0, y: 0 };
let resizeStart = { x: 0, y: 0, width: 0, height: 0 };
let resizeDirection = '';

type FileInputEvent = Event & { target: HTMLInputElement };

const handleImageUpload = async (event: Event) => {
  const { target } = event as FileInputEvent;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (reader.result) {
      image.value.src = reader.result as string;
    }
  };

  reader.readAsDataURL(file);

  image.value.onload = async () => {
    await nextTick();
    await setCanvasSize();
    drawImage();
    if (ctx.value && canvas.value) {
      originalImageData.value = ctx.value.getImageData(
        0,
        0,
        canvas.value.width,
        canvas.value.height,
      );
    }
    imageLoaded.value = true;
    cropOverlayVisible.value = true;

    console.log('Image loaded', ctx.value, canvas.value);
  };
};
const setCanvasSize = async () => {
  if (!canvas.value || !image.value) return;
  // const maxCanvasWidth = 500;
  // const aspectRatio = image.value.width / image.value.height;
  // if (image.value.width > maxCanvasWidth) {
  //   canvas.value.width = maxCanvasWidth;
  //   canvas.value.height = maxCanvasWidth / aspectRatio;
  // } else {
  //   canvas.value.width = image.value.width;
  //   canvas.value.height = image.value.height;
  // }
  ctx.value = canvas.value.getContext('2d')!;
};

const drawImage = () => {
  if (!canvas.value || !image.value || !ctx.value) return;

  const { width, height } = canvas.value.getBoundingClientRect();

  ctx.value.clearRect(0, 0, width, height);
  ctx.value.save();

  cropRegion.width = width;
  cropRegion.height = height;

  // Apply rotation
  ctx.value.translate(width / 2, height / 2);
  ctx.value.rotate((rotation * Math.PI) / 180);
  ctx.value.translate(-width / 2, -height / 2);

  ctx.value.drawImage(image.value, 0, 0, width, height);
  ctx.value.restore();
};

const rotateImage = (angle: number) => {
  rotation = (rotation + angle) % 360;
  drawImage();
};

const cropImage = () => {
  if (!ctx.value || !canvas.value) return;

  const canvasEl = canvas.value;
  const croppedData = ctx.value.getImageData(
    cropRegion.x,
    cropRegion.y,
    cropRegion.width,
    cropRegion.height,
  );

  // canvasEl.width = cropRegion.width;
  // canvasEl.height = cropRegion.height;

  ctx.value.clearRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.value.putImageData(croppedData, 0, 0);

  originalImageData.value = croppedData;
};

const resetImage = () => {
  if (!canvas.value) return;
  const { width, height } = canvas.value.getBoundingClientRect();

  rotation = 0;
  cropRegion.x = 0;
  cropRegion.y = 0;
  cropRegion.width = width;
  cropRegion.height = height;
  setCanvasSize();
  drawImage();
};

const startResize = (event: MouseEvent, direction: string) => {
  if (isDragging) return;

  isResizing = true;
  resizeDirection = direction;
  resizeStart = {
    x: event.clientX,
    y: event.clientY,
    width: cropRegion.width,
    height: cropRegion.height,
  };
  window.addEventListener('mousemove', onResize);
  window.addEventListener('mouseup', stopResize);
};

const onResize = (event: MouseEvent) => {
  if (!isResizing || !canvas.value) return;

  const { width, height } = canvas.value.getBoundingClientRect();

  const deltaX = event.clientX - resizeStart.x;
  const deltaY = event.clientY - resizeStart.y;

  if (resizeDirection.includes('right')) {
    cropRegion.width = Math.min(
      width - cropRegion.x,
      Math.max(20, resizeStart.width + deltaX),
    );
  }
  if (resizeDirection.includes('left')) {
    const newWidth = Math.max(20, resizeStart.width - deltaX);
    cropRegion.x = Math.max(0, cropRegion.x - (newWidth - cropRegion.width));
    cropRegion.width = newWidth;
  }
  if (resizeDirection.includes('bottom')) {
    cropRegion.height = Math.min(
      height - cropRegion.y,
      Math.max(20, resizeStart.height + deltaY),
    );
  }
  if (resizeDirection.includes('top')) {
    // TODO: fix resizing from top
    const newHeight = Math.max(20, resizeStart.height - deltaY);
    console.log(newHeight);
    cropRegion.y = Math.max(0, cropRegion.y - (newHeight - cropRegion.height));
    cropRegion.height = newHeight;
  }
};

const stopResize = () => {
  isResizing = false;
  resizeDirection = '';
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', stopResize);
};

const startDrag = (event: MouseEvent) => {
  if (isResizing) return;

  isDragging = true;
  dragStart = {
    x: event.clientX - cropRegion.x,
    y: event.clientY - cropRegion.y,
  };
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (event: MouseEvent) => {
  if (!isDragging || !canvas.value) return;

  const { width, height } = canvas.value.getBoundingClientRect();

  // Calculate new position while clamping within canvas bounds
  cropRegion.x = Math.max(
    0,
    Math.min(event.clientX - dragStart.x, width - cropRegion.width),
  );
  cropRegion.y = Math.max(
    0,
    Math.min(event.clientY - dragStart.y, height - cropRegion.height),
  );
};

const stopDrag = () => {
  isDragging = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

onMounted(() => {
  if (!canvas.value) return;

  ctx.value = canvas.value.getContext('2d')!;
});
</script>

<template>
  <div class="p-4 border rounded space-y-4">
    <input
      type="file"
      accept="image/*"
      ref="fileInput"
      @change="handleImageUpload"
      class="file-input file-input-bordered w-full max-w-xs"
    />

    <div class="flex flex-col items-center relative">
      <canvas ref="canvas" class="border rounded shadow w-full"></canvas>

      <div
        v-if="cropOverlayVisible && imageLoaded"
        class="absolute border-2 border-dashed border-gray-500 bg-gray-300 bg-opacity-10"
        :style="{
          top: cropRegion.y + 'px',
          left: cropRegion.x + 'px',
          width: cropRegion.width + 'px',
          height: cropRegion.height + 'px',
        }"
        @mousedown="startDrag"
      >
        <div
          class="absolute w-3 h-3 bg-blue-500 cursor-nwse-resize"
          style="top: -5px; left: -5px"
          @mousedown="startResize($event, 'top-left')"
        ></div>
        <div
          class="absolute w-3 h-3 bg-blue-500 cursor-nesw-resize"
          style="top: -5px; right: -5px"
          @mousedown="startResize($event, 'top-right')"
        ></div>
        <div
          class="absolute w-3 h-3 bg-blue-500 cursor-nesw-resize"
          style="bottom: -5px; left: -5px"
          @mousedown="startResize($event, 'bottom-left')"
        ></div>
        <div
          class="absolute w-3 h-3 bg-blue-500 cursor-nwse-resize"
          style="bottom: -5px; right: -5px"
          @mousedown="startResize($event, 'bottom-right')"
        ></div>
      </div>

      <div class="controls flex space-x-2 mt-2">
        <button class="btn btn-sm btn-primary" @click="rotateImage(90)">
          Rotate 90°
        </button>
        <button class="btn btn-sm btn-secondary" @click="cropImage">
          Crop
        </button>
        <button class="btn btn-sm btn-accent" @click="resetImage">Reset</button>
      </div>
    </div>
  </div>
</template>
