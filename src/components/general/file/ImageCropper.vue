<script setup lang="ts">
import { ref, nextTick, reactive, onMounted } from 'vue';

type Props = {
  imageSrc: string;
};
const props = defineProps<Props>();

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const image = ref<HTMLImageElement>(new Image());
const imageLoaded = ref(false);
const cropOverlayVisible = ref(false);
const originalImageData = ref<ImageData | null>(null);

let rotation = 0;
const cropRegion = reactive({ x: 0, y: 0, width: 200, height: 200 });
let isResizing = false;
let dragStart = { x: 0, y: 0 };
let resizeStart = { x: 0, y: 0, width: 0, height: 0 };
let resizeDirection = '';
const imagePosition = reactive({ x: 0, y: 0 }); // Image position on the canvas
let isDraggingImage = false;

let imageScaledWidth = 0;
let imageScaledHeight = 0;

const loadImage = () => {
  if (!props.imageSrc) return;
  image.value.src = props.imageSrc;

  const canvasWidth = canvas.value!.clientWidth;
  const canvasHeight = canvas.value!.clientHeight;

  const imageAspectRatio = image.value.width / image.value.height;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  imageScaledWidth =
    imageAspectRatio > canvasAspectRatio
      ? canvasWidth
      : canvasHeight * imageAspectRatio;
  imageScaledHeight =
    imageAspectRatio > canvasAspectRatio
      ? canvasWidth / imageAspectRatio
      : canvasHeight;

  cropRegion.x = 0;
  cropRegion.y = 0;
  cropRegion.width = imageScaledWidth;
  cropRegion.height = imageScaledHeight;

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

  const canvasWidth = canvas.value.clientWidth;
  const canvasHeight = canvas.value.clientHeight;
  canvas.value.width = canvasWidth;
  canvas.value.height = canvasHeight;

  ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.value.save();

  // Apply rotation
  ctx.value.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.value.rotate((rotation * Math.PI) / 180);
  ctx.value.translate(-canvasWidth / 2, -canvasHeight / 2);

  const imageAspectRatio = image.value.width / image.value.height;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  imageScaledWidth =
    imageAspectRatio > canvasAspectRatio
      ? canvasWidth
      : canvasHeight * imageAspectRatio;
  imageScaledHeight =
    imageAspectRatio > canvasAspectRatio
      ? canvasWidth / imageAspectRatio
      : canvasHeight;

  ctx.value.drawImage(
    image.value,
    0, // Source X
    0, // Source Y
    image.value.width, // Source Width
    image.value.height, // Source Height
    imagePosition.x, // Destination X
    imagePosition.y, // Destination Y
    imageScaledWidth, // Destination Width
    imageScaledHeight, // Destination Height
  );
  ctx.value.restore();

  drawCropRegion();
};

const drawCropRegion = () => {
  if (!canvas.value || !image.value || !ctx.value) return;

  const canvasWidth = canvas.value.clientWidth;
  const canvasHeight = canvas.value.clientHeight;

  // Crop Region
  ctx.value.save();
  ctx.value.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Dark semi-transparent overlay

  // Top part of the overlay (above the crop region)
  ctx.value.fillRect(0, 0, canvasWidth, cropRegion.y);

  // Left part of the overlay (left of the crop region)
  ctx.value.fillRect(0, cropRegion.y, cropRegion.x, cropRegion.height);

  // Right part of the overlay (right of the crop region)
  ctx.value.fillRect(
    cropRegion.x + cropRegion.width,
    cropRegion.y,
    canvasWidth - (cropRegion.x + cropRegion.width),
    cropRegion.height,
  );

  // Bottom part of the overlay (below the crop region)
  ctx.value.fillRect(
    0,
    cropRegion.y + cropRegion.height,
    canvasWidth,
    canvasHeight - (cropRegion.y + cropRegion.height),
  );

  ctx.value.restore();

  ctx.value.setLineDash([5, 8]);
  ctx.value.strokeStyle = 'white';
  ctx.value.lineWidth = 0;
  ctx.value.strokeRect(
    cropRegion.x,
    cropRegion.y,
    cropRegion.width,
    cropRegion.height,
  );
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

  ctx.value.clearRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.value.putImageData(croppedData, 0, 0);

  cropRegion.x = 0;
  cropRegion.y = 0;

  originalImageData.value = croppedData;

  return croppedData;
};

const resetImage = () => {
  rotation = 0;

  imagePosition.x = 0;
  imagePosition.y = 0;
  cropRegion.x = 0;
  cropRegion.y = 0;
  cropRegion.width = imageScaledWidth;
  cropRegion.height = imageScaledHeight;
  drawImage();
};

const startResize = (event: MouseEvent, direction: string) => {
  if (isDraggingImage) return;

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

    // console.log('diff', deltaX);
    // if (deltaX > 0) {
    //   imagePosition.x -= event.clientX;
    //   cropRegion.x -= event.clientX;
    // }
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
    cropRegion.y = Math.max(0, cropRegion.y - (newHeight - cropRegion.height));
    cropRegion.height = newHeight;
  }

  drawImage();
};

const stopResize = () => {
  isResizing = false;
  resizeDirection = '';
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', stopResize);

  drawImage();
};

const startDragImage = (event: MouseEvent) => {
  if (isResizing) return;

  isDraggingImage = true;
  dragStart = { x: event.clientX, y: event.clientY };
  window.addEventListener('mousemove', dragImage);
  window.addEventListener('mouseup', stopDragImage);
};

const dragImage = (event: MouseEvent) => {
  if (!isDraggingImage || isResizing) return;

  const deltaX = event.clientX - dragStart.x;
  const deltaY = event.clientY - dragStart.y;

  const angleRad = (rotation * Math.PI) / 180;
  const rotatedDeltaX =
    deltaX * Math.cos(angleRad) - deltaY * Math.sin(angleRad);
  const rotatedDeltaY =
    deltaX * Math.sin(angleRad) + deltaY * Math.cos(angleRad);

  // imagePosition.x += rotatedDeltaX;
  // imagePosition.y += rotatedDeltaY;

  // imagePosition.x = Math.min(
  //   cropRegion.x,
  //   Math.max(
  //     cropRegion.x + cropRegion.width - imageScaledWidth,
  //     imagePosition.x,
  //   ),
  // );

  // imagePosition.y = Math.min(
  //   cropRegion.y,
  //   Math.max(
  //     cropRegion.y + cropRegion.height - imageScaledHeight,
  //     imagePosition.y,
  //   ),
  // );
  imagePosition.x = Math.min(
    cropRegion.x,
    Math.max(
      imagePosition.x + rotatedDeltaX,
      cropRegion.x + cropRegion.width - imageScaledWidth,
    ),
  );

  imagePosition.y = Math.min(
    cropRegion.y,
    Math.max(
      imagePosition.y + rotatedDeltaY,
      cropRegion.y + cropRegion.height - imageScaledHeight,
    ),
  );

  dragStart = { x: event.clientX, y: event.clientY };
  drawImage();
};

const stopDragImage = () => {
  isDraggingImage = false;
  window.removeEventListener('mousemove', dragImage);
  window.removeEventListener('mouseup', stopDragImage);
};

onMounted(() => {
  if (!canvas.value) return;

  ctx.value = canvas.value.getContext('2d')!;

  loadImage();
});

defineExpose({
  ctx,
  cropImage,
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col items-center relative">
      <canvas
        ref="canvas"
        class="border rounded shadow w-full"
        @mousedown="startDragImage"
      ></canvas>

      <div
        v-if="cropOverlayVisible && imageLoaded"
        class="absolute"
        :style="{
          top: cropRegion.y + 'px',
          left: cropRegion.x + 'px',
          width: cropRegion.width + 'px',
          height: cropRegion.height + 'px',
        }"
        @mousedown="startDragImage"
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

      <div class="absolute right-0 top-0 flex justify-end w-full join m-1">
        <button
          type="button"
          class="btn btn-sm btn-primary btn-square btn-outline join-item"
          @click="rotateImage(-90)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-3 fill-current"
          >
            <path
              d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-primary btn-square btn-outline join-item"
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
        </button>

        <button
          type="button"
          class="btn btn-sm btn-accent join-item"
          @click="resetImage"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
