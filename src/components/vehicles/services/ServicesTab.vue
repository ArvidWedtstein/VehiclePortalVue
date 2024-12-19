<script setup lang="ts">
import { useServicesStore } from '@/stores/services';
import { defineAsyncComponent, onBeforeMount, ref, toRef } from 'vue';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';
import type { Tables } from '@/database.types';
import { useConfirm } from '@/lib/composables/useConfirm';
import MenuItem from '@/components/general/menu/MenuItem.vue';
import ListGroup from '@/components/general/list/ListGroup.vue';
import ListGroupItem from '@/components/general/list/ListGroupItem.vue';

const ServiceModal = defineAsyncComponent(
  async () => await import('@/components/vehicles/services/ServiceModal.vue'),
);

const servicesStore = useServicesStore();

const services = toRef(servicesStore, 'services');
const { getServices, deleteService } = servicesStore;

const serviceModal = ref();

const handleServiceDelete = async (
  service_id: Tables<'VehicleServiceLogs'>['id'],
) => {
  const result = await useConfirm({
    title: 'Delete Service?',
    message:
      'Are you sure you want to delete this service? This cannot be undone.',
    confirmLabel: 'Delete',
    severity: 'danger',
  });

  if (!result) return;

  deleteService(service_id);
};

onBeforeMount(() => {
  getServices();
});
</script>

<template>
  <ServiceModal ref="serviceModal" />

  <div class="flex justify-between">
    <button
      type="button"
      class="btn btn-accent btn-block md:w-auto"
      @click="serviceModal.open()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="w-4 fill-current"
      >
        <path
          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
        />
      </svg>
      Add Service
    </button>
  </div>

  <ListGroup class="h-auto md:max-h-[50vh] divide-y divide-neutral">
    <ListGroupItem
      v-for="(service, index) in services"
      :key="index"
      :title="service.type"
      as="RouterLink"
      class="hover:bg-base-content/5 transition-colors"
      :to="{
        name: 'service',
        params: {
          id: service.id,
        },
      }"
    >
      <template #icon="{ sizeClass }">
        <svg
          v-if="service.type?.toLowerCase().includes('wheel')"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="p-2 fill-current"
          :class="sizeClass"
        >
          <path
            d="M256 84C161 84 84 161 84 256S161 428 256 428S428 351 428 256S351 84 256 84ZM256 132C274.625 132 292 136.375 307.875 143.75L281.25 180.5C273.25 177.75 264.875 176 256 176S238.75 177.75 230.75 180.5L204.125 143.75C220 136.375 237.375 132 256 132ZM133.5 270.5C132.875 265.75 132 261 132 256C132 223.5 144.875 194.125 165.375 172L191.875 208.625C182 221.875 176 238.125 176 256C176 256.25 176.125 256.5 176.125 256.75L133.5 270.5ZM232 377.625C195.875 370.5 165.75 347.375 148.25 316.25L191 302.375C201 316.25 215.25 326.625 232 331.875V377.625ZM256 288C238.375 288 224 273.625 224 256S238.375 224 256 224S288 238.375 288 256S273.625 288 256 288ZM280 377.625V331.875C296.75 326.625 311 316.25 321 302.375L363.75 316.25C346.25 347.375 316.125 370.5 280 377.625ZM335.875 256.75C335.875 256.5 336 256.25 336 256C336 238.125 330 221.875 320.125 208.625L346.625 172C367.125 194.125 380 223.5 380 256C380 261 379.125 265.75 378.5 270.5L335.875 256.75ZM256 0C114.625 0 0 114.625 0 256S114.625 512 256 512S512 397.375 512 256S397.375 0 256 0ZM256 464C141.25 464 48 370.75 48 256S141.25 48 256 48S464 141.25 464 256S370.75 464 256 464Z"
          />
        </svg>
        <svg
          v-else-if="service.type?.toLowerCase().includes('oil')"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          class="p-2 fill-current"
          :class="sizeClass"
        >
          <path
            d="M320 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 0 32-80 0-48 0-48 0c-26.5 0-48 21.5-48 48l0 64.8c0 19 11.2 36.2 28.5 43.9l67.5 30L96 368c0 26.5 21.5 48 48 48l259.1 0c18.4 0 35.8-7.9 48-21.7L633.5 187.7c12.3-13.9-.3-35.4-18.4-31.5L448 192l-50.5-25.2c-8.9-4.4-18.7-6.8-28.6-6.8L288 160l0-32 32 0zM96 208l0 86.1L48 272.8 48 208l48 0z"
          />
        </svg>
        <!--Body panel work-->
        <!-- v-else-if="service.type?.toLowerCase().includes('body')" -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="p-3 fill-current"
          :class="sizeClass"
        >
          <path
            d="M488 464H279.75C266.938 464 254.375 461.656 242.438 457.062L48 382.375V358.063L246.312 307.25C254.75 305.094 263.438 304 272.125 304H488C501.25 304 512 293.25 512 280S501.25 256 488 256H383.262L130.436 9.373C124.396 3.334 116.195 -0.041 107.656 0L31.857 0.361C11.723 0.457 -3.322 18.904 0.635 38.648L60.693 305.254L30.094 313.094C12.375 317.625 0 333.562 0 351.844V387.875C0 404.281 10.281 419.281 25.656 425.219L225.188 501.844C242.625 508.594 261 512 279.75 512H488C501.25 512 512 501.25 512 488S501.25 464 488 464ZM216 352C202.746 352 192 362.744 192 376C192 389.254 202.746 400 216 400H360C373.254 400 384 389.254 384 376C384 362.744 373.254 352 360 352H216Z"
          />
        </svg>
      </template>

      <template #subtitle>
        <dl class="flex items-center flex-nowrap gap-1">
          <template v-if="service.date">
            <dt>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                class="w-4 fill-current"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                  clip-rule="evenodd"
                />
              </svg>
            </dt>
            <dd>
              <time class="hidden md:block" :datetime="service.date">
                {{
                  formatDate(service.date, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                }}
              </time>
              <time class="md:hidden" :datetime="service.date">
                {{
                  formatDate(service.date, {
                    dateStyle: 'short',
                    timeStyle: 'none',
                  })
                }}
              </time>
            </dd>
          </template>

          <dt class="hidden md:block border-l border-neutral ml-2 pl-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-4 fill-current"
            >
              <path
                d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2c0 0 0 0 0 0s0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4l0 3.4 0 5.7 0 26.3zm32 0l0-32 0-25.9c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 44.2-86 80-192 80S0 476.2 0 432l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z"
              />
            </svg>
          </dt>
          <dd>
            {{
              formatNumber(service.cost || 0, {
                style: 'currency',
                currency: service.currency || 'EUR',
                currencyDisplay: 'narrowSymbol',
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
                notation: 'standard',
              })
            }}
          </dd>

          <dt class="border-l border-neutral ml-2 pl-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              class="w-4 fill-current"
            >
              <path
                d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-223.1L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6l29.7 0c33.7 0 64.9 17.7 82.3 46.6l44.9 74.7c-16.1 17.6-28.6 38.5-36.6 61.5c-1.9-1.8-3.5-3.9-4.9-6.3L232 256.9 232 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128-16 0zM432 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm0 240a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM368 321.6l0 6.4c0 8.8 7.2 16 16 16s16-7.2 16-16l0-6.4c0-5.3 4.3-9.6 9.6-9.6l40.5 0c7.7 0 13.9 6.2 13.9 13.9c0 5.2-2.9 9.9-7.4 12.3l-32 16.8c-5.3 2.8-8.6 8.2-8.6 14.2l0 14.8c0 8.8 7.2 16 16 16s16-7.2 16-16l0-5.1 23.5-12.3c15.1-7.9 24.5-23.6 24.5-40.6c0-25.4-20.6-45.9-45.9-45.9l-40.5 0c-23 0-41.6 18.6-41.6 41.6z"
              />
            </svg>
          </dt>
          <dd class="text-nowrap truncate">
            {{ service.provider }}
          </dd>
        </dl>
      </template>

      <template #endIcon>
        <RouterLink
          class="md:hidden btn btn-sm mr-3"
          :to="{
            name: 'service',
            params: {
              id: service.id,
            },
          }"
        >
          Details
        </RouterLink>
        <div class="hidden md:dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-sm btn-ghost btn-circle flex mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="h-5 w-5 fill-current"
            >
              <path
                d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
          >
            <MenuItem
              :to="{
                name: 'service',
                params: {
                  id: service.id,
                },
              }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                class="w-3 fill-current"
              >
                <path
                  d="M572.531 238.973C518.281 115.525 410.938 32 288 32S57.688 115.58 3.469 238.973C1.562 243.402 0 251.041 0 256C0 260.977 1.562 268.596 3.469 273.025C57.719 396.473 165.062 480 288 480S518.312 396.418 572.531 273.025C574.438 268.596 576 260.957 576 256C576 251.023 574.438 243.402 572.531 238.973ZM288 432C188.521 432 96.836 364.502 48.424 256.004C97.01 147.365 188.611 80 288 80C387.48 80 479.164 147.498 527.576 255.994C478.99 364.635 387.389 432 288 432ZM288 128C217.334 128 160 185.348 160 256S217.334 384 288 384H288.057C358.695 384 416 326.68 416 256.055V256C416 185.348 358.668 128 288 128ZM288 336C243.889 336 208 300.111 208 256C208 255.252 208.199 254.559 208.221 253.816C213.277 255.125 218.52 256 224 256C259.346 256 288 227.346 288 192C288 186.52 287.125 181.277 285.816 176.221C286.559 176.199 287.252 176 288 176C332.111 176 368 211.889 368 256.055C368 300.137 332.137 336 288 336Z"
                />
              </svg>
              View
            </MenuItem>
            <MenuItem @click="serviceModal.open(service.id)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="w-3 fill-current"
              >
                <path
                  d="M455.703 18.748C443.209 6.252 426.829 0 410.452 0C394.07 0 377.695 6.25 365.196 18.75L45.11 338.885C36.542 347.451 30.584 358.275 27.926 370.094L0.319 492.854C-1.701 502.967 6.158 512 15.946 512C16.993 512 18.061 511.896 19.143 511.68C19.143 511.68 103.751 493.73 141.894 484.748C153.432 482.031 163.759 476.225 172.139 467.844C221.264 418.719 406.649 233.33 493.302 146.676C518.294 121.684 518.202 81.256 493.212 56.262L455.703 18.748ZM138.201 433.902C136.086 436.018 133.697 437.365 130.893 438.025C112.719 442.307 83.432 448.738 58.204 454.203L74.751 380.627C75.417 377.668 76.902 374.973 79.048 372.824L320.936 130.902L381.064 191.035L138.201 433.902Z"
                />
              </svg>
              Edit
            </MenuItem>
            <MenuItem @click="handleServiceDelete(service.id)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="w-3 fill-current"
              >
                <path
                  d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                />
              </svg>
              Delete
            </MenuItem>
          </ul>
        </div>
      </template>
    </ListGroupItem>
  </ListGroup>
</template>
