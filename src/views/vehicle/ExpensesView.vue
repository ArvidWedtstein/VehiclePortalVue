<script setup lang="ts">
import ResizerPanel from '@/components/general/utils/ResizerPanel.vue';
import ExpensesTab from '@/components/vehicles/expenses/ExpensesTab.vue';
</script>

<template>
  <ResizerPanel :minSize="30">
    <template #left>
      <ExpensesTab />
    </template>
    <template #right>
      <RouterView></RouterView>
    </template>
  </ResizerPanel>
</template>
