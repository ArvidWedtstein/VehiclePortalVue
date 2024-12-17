import { ref, onMounted, onBeforeUnmount, type Ref, computed } from 'vue';

export const useVirtualScroll = <T>(
  fetchData: (
    filters: undefined,
    columns: ['*'],
    range: [number, number],
  ) => Promise<T[]>,
  itemHeight: number,
  itemsPerPage: number = 10,
  scrollContainerRef: Ref<HTMLElement | null>,
) => {
  const data = ref<T[]>([]);
  const visibleItems = ref<T[]>([]);

  const loading = ref(false);

  const totalItems = ref(0);
  const scrollTop = ref(0);

  const updateVisibleItems = () => {
    if (!scrollContainerRef.value) return;

    const containerHeight = scrollContainerRef.value.$el.clientHeight;
    const startIndex = Math.floor(scrollTop.value / itemHeight);
    const endIndex = Math.min(
      Math.floor((scrollTop.value + containerHeight) / itemHeight),
      data.value.length - 1,
    );

    visibleItems.value = data.value.slice(startIndex, endIndex + 1);
  };

  const loadMoreData = async (offset: number) => {
    loading.value = true;

    const fetchedData = await fetchData(
      undefined,
      ['*'],
      [offset, offset + itemsPerPage - 1],
    );

    if (fetchedData.length > 0) {
      data.value = [...(data.value as T[]), ...(fetchedData as T[])];
      totalItems.value += fetchedData.length;
    }

    loading.value = false;
  };

  const onScroll = () => {
    if (!scrollContainerRef.value) return;

    const container = scrollContainerRef.value.$el;
    scrollTop.value = container.scrollTop;

    updateVisibleItems();

    if (
      container.scrollHeight - container.scrollTop === container.clientHeight &&
      !loading.value
    ) {
      console.log(
        'load moar',
        container.scrollHeight - container.scrollTop,
        container.clientHeight,
        totalItems.value,
      );
      loadMoreData(data.value.length);
    }
  };

  onMounted(async () => {
    await loadMoreData(0);

    if (scrollContainerRef.value) {
      if (scrollContainerRef.value.$el) {
        scrollContainerRef.value.$el.addEventListener('scroll', onScroll);
      } else {
        scrollContainerRef.value.addEventListener('scroll', onScroll);
      }
    }

    updateVisibleItems();
  });

  onBeforeUnmount(() => {
    if (scrollContainerRef.value) {
      if (scrollContainerRef.value.$el) {
        scrollContainerRef.value.$el.removeEventListener('scroll', onScroll);
      } else {
        scrollContainerRef.value.removeEventListener('scroll', onScroll);
      }
    }
  });

  return {
    visibleItems,
    loading,
    totalItems,
  };
};
