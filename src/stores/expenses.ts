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

  const loading = ref(false);

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

      // if (
      //   expenses.value.filter(
      //     ({ vehicle_id }) => vehicle_id === currentVehicle.value?.id,
      //   ).length > 0 ||
      //   expensesCache.has(currentVehicle.value.id)
      // )
      //   return expensesCache.get(currentVehicle.value.id);

      loading.value = true;

      const {
        data = [],
        error,
        status,
      } = await supabase
        .from('VehicleExpenses')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.value.id)
        .limit(100)
        .order('date', { ascending: false })
        .returns<Tables<'VehicleExpenses'>[]>();

      if (error && status !== 406) throw error;

      expensesCache.set(currentVehicle.value.id, [
        ...new Map(
          [
            ...(expensesCache.get(currentVehicle.value.id) ?? []),
            ...(data ?? []),
          ].map(item => [item['id'], item]),
        ).values(),
      ]);

      expenses.value = [
        ...new Map(
          [...expenses.value, ...(data ?? [])].map(item => [item['id'], item]),
        ).values(),
      ];

      return data ?? [];
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const upsertExpense = async (
    pData: TablesInsert<'VehicleExpenses'> | TablesUpdate<'VehicleExpenses'>,
  ) => {
    try {
      loading.value = true;

      const { data, error } = await supabase
        .from('VehicleExpenses')
        .upsert({
          ...pData,
          vehicle_id: currentVehicle.value?.id || -1,
        })
        .select();

      if (error) {
        throw error;
      }

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
    } finally {
      loading.value = false;
    }
  };

  const deleteExpense = async (expense_id: Tables<'VehicleExpenses'>['id']) => {
    try {
      loading.value = true;

      const { error } = await supabase
        .from('VehicleExpenses')
        .delete()
        .eq('id', expense_id);

      if (error) throw error;

      expenses.value = expenses.value.filter(({ id }) => id !== expense_id);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return { expenses, getExpenses, upsertExpense, deleteExpense, loading };
});
