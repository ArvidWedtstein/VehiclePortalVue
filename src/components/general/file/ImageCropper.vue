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
  };
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

  const imageAspectRatio = image.value.width / image.value.height;
  const canvasAspectRatio = width / height;

  let drawWidth, drawHeight;
  if (imageAspectRatio > canvasAspectRatio) {
    // Image is wider than the canvas
    drawWidth = width;
    drawHeight = drawWidth / imageAspectRatio;
  } else {
    // Image is taller than or fits within the canvas
    drawHeight = height;
    drawWidth = drawHeight * imageAspectRatio;
  }

  // Draw image scaled within the canvas, starting at the top-left corner
  ctx.value.drawImage(
    image.value,
    0, // Source X
    0, // Source Y
    image.value.width, // Source Width
    image.value.height, // Source Height
    0, // Destination X
    0, // Destination Y
    drawWidth, // Destination Width
    drawHeight, // Destination Height
  );
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
    const newHeight = Math.max(
      20,
      Math.min(resizeStart.height - deltaY, height),
    );
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
  <div class="space-y-4">
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

      <div class="flex w-full join mt-2">
        <button
          class="btn btn-sm btn-primary join-item"
          @click="rotateImage(90)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-3 fill-current"
          >
            <path
              d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"
            />
          </svg>
          Rotate 90°
        </button>
        <button class="btn btn-sm btn-secondary join-item" @click="cropImage">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="fill-current w-3"
          >
            <path
              d="M448 109.3l54.6-54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L402.7 64 160 64l0 64 178.7 0L128 338.7 128 32c0-17.7-14.3-32-32-32S64 14.3 64 32l0 32L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l32 0 0 256c0 35.3 28.7 64 64 64l224 0 0-64-178.7 0L384 173.3 384 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-274.7z"
            />
          </svg>
          Crop
        </button>
        <button class="btn btn-sm btn-accent join-item" @click="resetImage">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
