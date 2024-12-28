<script setup lang="ts">
import { ref } from 'vue';
import ListGroup from '../list/ListGroup.vue';
import ListGroupItem from '../list/ListGroupItem.vue';
import ChevronRight from '@/assets/icons/ChevronRight.vue';

type Option = {
  title: string;
  type?: 'checkbox' | 'radio' | 'range' | 'text';
  subOptions?: Array<string>;
};
type Props = {
  /**
   * Set up option by using slot with name of option
   */
  options?: Array<Option>;
};

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
});

// TODO: replace with with map or something similar
const checkedOptions = ref<Array<Option & { selected: Array<string> }>>(
  props.options.map(opt => ({ ...opt, selected: [] })),
);

const currentPage = ref<Option | null>(null);

const setPage = (option: Option | null) => {
  currentPage.value = option;
};

// TODO: find a better way
const checkSubOption = (event: Event, subOption: string) => {
  const currentOption = currentPage.value?.title;
  if (!currentOption) return;

  checkedOptions.value = checkedOptions.value.map(opt => {
    if (opt.title === currentOption) {
      return {
        ...opt,
        selected: opt.selected.some(p => p === subOption)
          ? opt.selected.filter(opt => opt !== subOption)
          : [...opt.selected, subOption],
      };
    }
    return opt;
  });

  console.log(checkedOptions.value);
};
</script>

<template>
  <div class="">
    <ListGroup
      v-if="!currentPage"
      class="menu p-0 [&_li>*]:rounded-none divide-y divide-neutral divide-opacity-75"
    >
      <ListGroupItem
        v-for="(option, optionIndex) in options"
        :key="optionIndex"
        size="sm"
        @click="setPage(option)"
        :title="option.title"
      >
        <template #endIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            class="w-3 fill-current"
          >
            <path
              d="M113.333 47.409L297.314 239.407C301.783 244.032 304.001 250.032 304.001 256.001S301.783 267.969 297.314 272.594L113.333 464.592C104.181 474.186 88.994 474.499 79.431 465.311C69.806 456.186 69.494 440.936 78.712 431.405L246.759 256.001L78.712 80.596C69.494 71.096 69.806 55.815 79.431 46.69C88.994 37.503 104.181 37.815 113.333 47.409Z"
            />
          </svg>
        </template>
      </ListGroupItem>
    </ListGroup>

    <template v-else>
      <div class="flex flex-col items-center gap-1 p-2">
        <div class="flex flex-row items-center gap-1 w-full">
          <button
            type="button"
            class="btn btn-sm btn-ghost"
            @click="setPage(null)"
          >
            <ChevronRight class="w-3" />
          </button>

          <div class="divider divider-neutral text-lg font-semibold grow">
            {{ currentPage.title }}
          </div>

          <div class="btn btn-sm invisible"></div>
        </div>

        <slot :name="currentPage.title.replace(/\s/g, '_').toLowerCase()">
          <template v-if="currentPage.type === 'checkbox'">
            <div
              class="flex flex-col items-start divide-y divide-neutral w-full"
            >
              <label
                v-for="(subOption, subOptionIndex) in currentPage.subOptions ||
                []"
                :key="subOptionIndex"
                class="label gap-3 cursor-pointer w-full"
              >
                <input
                  type="checkbox"
                  :checked="
                    checkedOptions
                      .find(p => p.title === currentPage?.title)
                      ?.selected.some(opt => opt === subOption)
                  "
                  class="checkbox checkbox-accent"
                  @change="$event => checkSubOption($event, subOption)"
                />
                <span class="label-text grow">{{ subOption }}</span>
              </label>
            </div>
          </template>
        </slot>
      </div>
    </template>
  </div>
</template>
