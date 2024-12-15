<script setup lang="ts">
import { useServicesStore } from '@/stores/services';
import { onBeforeMount, ref, toRef } from 'vue';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';
import ServiceModal from '@/components/vehicles/services/ServiceModal.vue';

const servicesStore = useServicesStore();

const services = toRef(servicesStore, 'services');
const { getServices, deleteService } = servicesStore;

const serviceModal = ref();

onBeforeMount(() => {
  getServices();
});
</script>

<template>
  <ServiceModal ref="serviceModal" />

  <div class="flex justify-between">
    <button type="button" class="btn btn-accent" @click="serviceModal.open()">
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

  <ul
    class="my-4 mb-14 md:mb-4 text-sm divide-y divide-neutral h-auto md:max-h-[70vh] overflow-y-auto"
  >
    <li
      class="relative flex items-center space-x-6 py-3"
      v-for="(service, index) in services"
      :key="index"
    >
      <div class="w-10 h-10 flex-none rounded-full border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          class="h-10 w-10 p-2 fill-current"
        >
          <path
            d="M320 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 0 32-80 0-48 0-48 0c-26.5 0-48 21.5-48 48l0 64.8c0 19 11.2 36.2 28.5 43.9l67.5 30L96 368c0 26.5 21.5 48 48 48l259.1 0c18.4 0 35.8-7.9 48-21.7L633.5 187.7c12.3-13.9-.3-35.4-18.4-31.5L448 192l-50.5-25.2c-8.9-4.4-18.7-6.8-28.6-6.8L288 160l0-32 32 0zM96 208l0 86.1L48 272.8 48 208l48 0z"
          />
        </svg>
      </div>

      <div class="flex-1">
        <h3 class="capitalize font-semibold xl:pr-0">
          {{ service.type }}
        </h3>
        <dl class="mt-2 flex flex-col xl:flex-row">
          <div class="flex items-start flex-nowrap space-x-3">
            <dt class="mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                class="h-5 w-5 fill-current"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                  clip-rule="evenodd"
                />
              </svg>
            </dt>
            <dd>
              <time v-if="service.date" :datetime="service.date">
                {{ formatDate(service.date, { dateStyle: 'medium' }) }}
              </time>
            </dd>
          </div>
          <div
            class="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-neutral xl:pl-3.5"
          >
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
          </div>
          <div
            v-if="service.provider"
            class="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-neutral xl:pl-3.5"
          >
            <dd>{{ service.provider }}</dd>
          </div>
          <div
            class="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-neutral xl:pl-3.5"
          >
            <dd>{{ service.notes }}</dd>
          </div>
        </dl>
      </div>
      <div class="xl:relative">
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
              fill="currentColor"
              aria-hidden="true"
              data-slot="icon"
              class="h-5 w-5"
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
            <li>
              <RouterLink
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
              </RouterLink>
            </li>
            <li>
              <button type="button" @click="serviceModal.open(service.id)">
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
              </button>
            </li>
            <li>
              <button type="button" @click="deleteService(service.id)">
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
              </button>
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>
