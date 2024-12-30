<script setup lang="ts">
import { computed, ref } from 'vue';
import ListGroup from '../list/ListGroup.vue';
import ListGroupItem from '../list/ListGroupItem.vue';
import ChevronRight from '@/assets/icons/ChevronRight.vue';
import CheckboxGroup from './forms/CheckboxGroup.vue';
import RadioGroup from './forms/RadioGroup.vue';
import { formatDateRange } from '@/utils/date';

type OptionType =
  | 'checkbox'
  | 'radio'
  | 'range'
  | 'text'
  | 'from-to-date'
  | 'boolean';

type FromToDateType = { from: string; to: string };

// TODO: adjust subOptions based on type
type Option = {
  title: string;
  type: OptionType;
  subOptions?: Array<string>;
  value?: string | number | Array<string> | FromToDateType | boolean;
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

const defaultValues: Record<
  OptionType,
  string | number | Array<string> | FromToDateType | boolean
> = {
  checkbox: [],
  radio: '',
  'from-to-date': {
    from: '',
    to: '',
  },
  range: 0,
  text: '',
  boolean: false,
};

const filterOptions = ref<Array<Option>>(
  props.options.map(opt => ({
    ...opt,
    value: defaultValues[opt.type],
  })),
);

const currentPage = ref<Option['title'] | null>(null);

const setPage = (option: Option | null) => {
  currentPage.value = option?.title || null;
};

const resetFilters = () => {
  filterOptions.value = filterOptions.value.map(opt => ({
    ...opt,
    value: defaultValues[opt.type],
  }));
};

const updateCheckbox = (filterTitle: string, value: string) => {
  const optionIdx = filterOptions.value.findIndex(
    opt => opt.title === filterTitle,
  );
  if (optionIdx === -1 || !Array.isArray(filterOptions.value[optionIdx].value))
    return;

  if (filterOptions.value[optionIdx].value.includes(value)) {
    filterOptions.value[optionIdx].value = filterOptions.value[
      optionIdx
    ].value.filter(item => item !== value);
  } else {
    filterOptions.value[optionIdx].value.push(value);
  }
};

const updateRadio = (filterTitle: string, value: string) => {
  const optionIdx = filterOptions.value.findIndex(
    opt => opt.title === filterTitle,
  );
  if (optionIdx === -1) return;

  filterOptions.value[optionIdx].value = value;
};

const updateRange = (filterTitle: string, value: number) => {
  const optionIdx = filterOptions.value.findIndex(
    opt => opt.title === filterTitle,
  );
  if (optionIdx === -1) return;

  filterOptions.value[optionIdx].value = value;
};

const updateText = (filterTitle: string, value: string) => {
  const optionIdx = filterOptions.value.findIndex(
    opt => opt.title === filterTitle,
  );
  if (optionIdx === -1) return;

  filterOptions.value[optionIdx].value = value;
};

const updateBoolean = (filterTitle: string) => {
  const optionIdx = filterOptions.value.findIndex(
    opt => opt.title === filterTitle,
  );
  if (optionIdx === -1) return;

  filterOptions.value[optionIdx].value = !filterOptions.value[optionIdx].value;
};

const updateFromToDate = (filterTitle: string, from: string, to: string) => {
  const optionIdx = filterOptions.value.findIndex(
    opt => opt.title === filterTitle,
  );
  if (optionIdx === -1) return;

  filterOptions.value[optionIdx].value = { from, to };
};

const currentOption = computed(() => {
  const option = filterOptions.value.find(
    opt => opt.title === currentPage.value || '',
  );

  return option;
});

const formattedBadgeValues = computed(() => {
  const result: Record<string, Array<string>> = {};

  for (const option of filterOptions.value) {
    const { title, type, value } = option;

    if (type === 'from-to-date') {
      const fromToDates = value as FromToDateType;

      if (fromToDates.from && fromToDates.to) {
        result[title] = [
          formatDateRange(fromToDates.from, fromToDates.to, {
            dateStyle: 'short',
          }),
        ];
      }
    } else if (type === 'checkbox') {
      result[title] = value as Array<string>;
    } else {
      result[title] = [];
    }
    // TODO: finish
  }

  return result;
});

const removeFilter = (event: MouseEvent, option: Option, index: number) => {
  event.stopPropagation();

  const options = filterOptions.value.find(opt => opt.title === option.title);

  switch (option.type) {
    case 'checkbox':
      updateCheckbox(option.title, (options?.value as Array<string>)[index]);
      break;
    case 'from-to-date':
      updateFromToDate(option.title, '', '');
      break;
    case 'radio':
      updateRadio(option.title, '');
      break;
    case 'range':
      updateRange(option.title, 0);
  }
};

defineExpose({
  filterOptions,
  setPage,
  resetFilters,
});
</script>

<template>
  <div class="">
    <div class="flex flex-row items-center gap-1 w-full">
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        :class="{ invisible: !currentOption }"
        @click="setPage(null)"
      >
        <ChevronRight class="w-3" />
      </button>

      <div class="divider divider-neutral text-lg font-semibold grow">
        {{ currentOption?.title || 'Filter' }}
      </div>

      <button type="button" class="btn btn-sm btn-ghost" @click="resetFilters">
        Reset
      </button>
    </div>

    <TransitionGroup name="list">
      <template v-if="!currentOption">
        <div class="flex items-center gap-2 overflow-x-auto">
          <div
            v-for="(option, optionIndex) in filterOptions.filter(
              ({ type }) => type === 'boolean',
            )"
            :key="optionIndex"
            class="badge badge-lg gap-2"
            :class="{ 'badge-accent': option.value }"
            @click="updateBoolean(option.title)"
          >
            {{ option.title }}
          </div>
        </div>
        <ListGroup>
          <ListGroupItem
            v-for="(option, optionIndex) in filterOptions.filter(
              ({ type }) => type !== 'boolean',
            )"
            :key="optionIndex"
            size="sm"
            @click="setPage(option)"
            :title="option.title"
            noHoverEffect
          >
            <template #title>
              {{ option.title }}

              <div
                v-for="(badge, badgeIndex) in formattedBadgeValues[
                  option.title
                ]"
                :key="badgeIndex"
                class="badge gap-2"
                @click="$event => removeFilter($event, option, badgeIndex)"
              >
                {{ badge }}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  class="w-2 fill-current"
                >
                  <path
                    d="M376.575 427.518C387.888 441.112 386.06 461.299 372.481 472.612C366.497 477.581 359.231 480.018 352.013 480.018C342.841 480.018 333.747 476.112 327.419 468.518L191.997 306.01L56.575 468.518C50.247 476.112 41.153 480.018 31.981 480.018C24.763 480.018 17.497 477.581 11.513 472.612C-2.065 461.299 -3.894 441.112 7.419 427.518L150.335 256.018L7.419 84.518C-3.894 70.924 -2.065 50.737 11.513 39.424C25.075 28.143 45.247 29.924 56.575 43.518L191.997 206.026L327.419 43.518C338.716 29.956 358.903 28.143 372.481 39.424C386.06 50.737 387.888 70.924 376.575 84.518L233.659 256.018L376.575 427.518Z"
                  />
                </svg>
              </div>
            </template>
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
      </template>

      <template v-else>
        <div class="flex flex-col items-center gap-4">
          <slot :name="currentOption.title.replace(/\s/g, '_').toLowerCase()">
            <div
              v-if="currentOption.type === 'checkbox'"
              class="flex flex-col items-start divide-y divide-neutral w-full"
            >
              <CheckboxGroup
                :options="currentOption.subOptions || []"
                @change="
                  value => updateCheckbox(currentOption?.title || '', value)
                "
                :selected="currentOption.value as Array<string>"
              />
            </div>

            <div
              v-else-if="currentOption.type === 'radio'"
              class="flex flex-col items-start divide-y divide-neutral w-full"
            >
              <RadioGroup
                :options="currentOption.subOptions || []"
                @change="
                  value => updateRadio(currentOption?.title || '', value)
                "
                :selected="currentOption.value as string"
              />
            </div>

            <div v-else-if="currentOption.type === 'range'" class="w-full">
              <input
                type="range"
                :value="currentOption.value"
                @input="
                  $event =>
                    updateRange(
                      currentOption?.title || '',
                      parseInt(($event.target as HTMLInputElement)?.value),
                    )
                "
                class="range"
              />
              <span>Value: {{ currentOption.value }}</span>
            </div>

            <div v-else-if="currentOption.type === 'text'" class="w-full">
              <input
                type="text"
                :value="currentOption.value"
                @input="
                  $event =>
                    updateText(
                      currentOption?.title || '',
                      ($event.target as HTMLInputElement)?.value,
                    )
                "
                class="input input-bordered w-full"
              />
            </div>

            <div
              v-else-if="currentOption.type === 'from-to-date'"
              class="w-full"
            >
              <div class="flex flex-col gap-2">
                <label class="flex flex-col">
                  From:
                  <input
                    type="date"
                    :value="(currentOption.value as FromToDateType).from"
                    :max="(currentOption.value as FromToDateType).to"
                    @input="
                      $event =>
                        updateFromToDate(
                          currentOption?.title || '',
                          ($event.target as HTMLInputElement)?.value,
                          (currentOption?.value as FromToDateType).to,
                        )
                    "
                    class="input input-bordered"
                  />
                </label>

                <label class="flex flex-col">
                  To:
                  <input
                    type="date"
                    :value="(currentOption.value as FromToDateType).to"
                    :min="(currentOption.value as FromToDateType).from"
                    @input="
                      $event =>
                        updateFromToDate(
                          currentOption?.title || '',
                          (currentOption?.value as FromToDateType).from,
                          ($event.target as HTMLInputElement)?.value,
                        )
                    "
                    class="input input-bordered"
                  />
                </label>
              </div>
            </div>
          </slot>
        </div>
      </template>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
