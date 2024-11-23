import { ref, toRef } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

export const useExpensesStore = defineStore('expenses', () => {
  const vehiclesStore = useVehiclesStore();
  const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

  const expenses = ref<Tables<'VehicleExpenses'>[]>([]);
  const expensesCache = new Map<number, Tables<'VehicleExpenses'>[]>();

  const getExpenses = async <
    Columns extends (keyof Tables<'VehicleExpenses'> | '*')[],
  >(
    filters?: FilterKeys<Tables<'VehicleExpenses'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      if (
        expenses.value.filter(
          ({ vehicle_id }) => vehicle_id === currentVehicle.value?.id,
        ).length > 0 ||
        expensesCache.has(currentVehicle.value.id)
      )
        return;

      const { data, error, status } = await supabase
        .from('VehicleExpenses')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.value.id)
        .limit(100)
        .returns<Tables<'VehicleExpenses'>[]>();

      if (error && status !== 406) throw error;

      expensesCache.set(currentVehicle.value.id, data ?? []);
      expenses.value = data ?? [];
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const upsertExpense = async (
    pData: TablesInsert<'VehicleExpenses'> | TablesUpdate<'VehicleExpenses'>,
  ) => {
    try {
      const { data, error } = await supabase
        .from('VehicleExpenses')
        .upsert({
          ...pData,
          vehicle_id: currentVehicle.value?.id || -1,
        })
        .select();

      if (error) throw error;

      const vExpenseIndex = expenses.value.findIndex(
        ({ id }) => id === data[0].id,
      );

      if (vExpenseIndex !== -1) {
        expenses.value[vExpenseIndex] = {
          ...expenses.value[vExpenseIndex],
          ...data[0],
        };

        return;
      }

      expenses.value.push(...data);
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const deleteExpense = async (expense_id: Tables<'VehicleExpenses'>['id']) => {
    try {
      const { error } = await supabase
        .from('VehicleExpenses')
        .delete()
        .eq('id', expense_id);

      if (error) throw error;

      expenses.value = expenses.value.filter(({ id }) => id !== expense_id);
    } catch (error) {
      console.error(error);
    }
  };

  return { expenses, getExpenses, upsertExpense, deleteExpense };
});
