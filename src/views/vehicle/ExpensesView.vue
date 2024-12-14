<script setup lang="ts">
import ExpensesTab from '@/components/vehicles/expenses/ExpensesTab.vue';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <component v-if="Component" :is="Component" />

    <ExpensesTab v-else />
  </RouterView>
</template>
