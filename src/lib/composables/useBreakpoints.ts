import { ref, onMounted, onUnmounted } from 'vue';

export function useBreakpoints() {
  const width = ref(window.innerWidth);

  const updateWidth = () => {
    width.value = window.innerWidth;
  };

  // Define breakpoints based on Tailwind's default breakpoints
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  const isSm = ref(false);
  const isMd = ref(false);
  const isLg = ref(false);
  const isXl = ref(false);
  const is2Xl = ref(false);

  const checkBreakpoints = () => {
    const { sm, md, lg, xl, '2xl': xxl } = breakpoints;
    const w = width.value;

    isSm.value = w >= sm && w < md;
    isMd.value = w >= md;
    isLg.value = w >= lg;
    isXl.value = w >= xl;
    is2Xl.value = w >= xxl;
  };

  onMounted(() => {
    updateWidth();
    checkBreakpoints();
    window.addEventListener('resize', updateWidth);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
  });

  return {
    width,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
  };
}
