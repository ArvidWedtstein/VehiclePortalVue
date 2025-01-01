<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex flex-col gap-3 flex-1">
    <div class="hero shrink-0">
      <div class="hero-content text-neutral-content text-center">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">
            Welcome to
            <div class="indicator">
              <span
                class="indicator-item badge badge-warning badge-outline badge-lg"
              >
                Hub
              </span>
              <div class="font-bold">Vehicle</div>
            </div>
          </h1>
          <p class="mb-5">Lorem ipsum</p>
          <RouterLink :to="{ name: 'signIn' }" class="btn btn-primary">
            Get Started
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="flex-1 mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-center text-base/7 font-semibold text-accent">
        Expense Tracking
      </h2>
      <p
        class="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-base-content sm:text-5xl"
      >
        Keep track of your expenses
      </p>
      <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
        <div class="relative lg:row-span-2">
          <div
            class="absolute inset-px rounded-lg bg-base-200 border border-base-100 lg:rounded-l-[2rem]"
          />
          <div
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]"
          >
            <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
              <p
                class="mt-2 text-lg font-medium tracking-tight text-base-content max-lg:text-center"
              >
                Mobile friendly
              </p>
              <p
                class="mt-2 max-w-lg text-sm/6 text-base-content max-lg:text-center"
              >
                We've ensured the app is usable on mobile devices too! 🥳
              </p>
            </div>
            <div
              class="@container relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm"
            >
              <div
                class="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl"
              >
                <!--TODO: replace image-->
                <img
                  class="size-full object-cover object-top"
                  src="https://placehold.co/200x400"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div
            class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-base-300/5 lg:rounded-l-[2rem]"
          ></div>
        </div>
        <div class="relative max-lg:row-start-1">
          <div
            class="absolute inset-px rounded-lg bg-base-200 border border-base-100 max-lg:rounded-t-[2rem]"
          ></div>
          <div
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]"
          >
            <div class="px-8 pt-8 sm:px-10 sm:pt-10">
              <p
                class="mt-2 text-lg font-medium tracking-tight text-base-content max-lg:text-center"
              >
                Performance
              </p>
              <p
                class="mt-2 max-w-lg text-sm/6 text-base-content max-lg:text-center"
              >
                Working on it...
              </p>
            </div>
            <div
              class="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2"
            >
              <img
                class="w-full max-lg:max-w-xs"
                src="https://placehold.co/200x100"
                alt=""
              />
            </div>
          </div>
          <div
            class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-t-[2rem]"
          />
        </div>
        <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
          <div
            class="absolute inset-px rounded-lg bg-base-200 border border-base-100"
          ></div>
          <div
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]"
          >
            <div class="px-8 pt-8 sm:px-10 sm:pt-10">
              <p
                class="mt-2 text-lg font-medium tracking-tight text-base-content max-lg:text-center"
              >
                Security
              </p>
              <p
                class="mt-2 max-w-lg text-sm/6 text-base-content max-lg:text-center"
              >
                We only use google for login
              </p>
            </div>
            <div
              class="@container flex flex-1 items-center max-lg:py-6 lg:pb-2"
            >
              <img
                class="h-[min(152px,40cqw)] object-cover"
                src="https://placehold.co/600x400"
                alt=""
              />
            </div>
          </div>
          <div
            class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5"
          ></div>
        </div>
        <div class="relative lg:row-span-2">
          <div
            class="absolute inset-px rounded-lg bg-base-200 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"
          ></div>
          <div
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]"
          >
            <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
              <p
                class="mt-2 text-lg font-medium tracking-tight text-base-content max-lg:text-center"
              >
                Lorem ipsum
              </p>
              <p
                class="mt-2 max-w-lg text-sm/6 text-base-content max-lg:text-center"
              >
                Sit quis amet rutrum tellus ullamcorper ultricies libero dolor
                eget sem sodales gravida.
              </p>
            </div>
          </div>
          <div
            class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
