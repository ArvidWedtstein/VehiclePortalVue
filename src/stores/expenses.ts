import { computed, ref, toRef } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

export const useExpensesStore = defineStore('expenses', () => {
  const vehiclesStore = useVehiclesStore();
  const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

  const expensesCache = new Map<
    Tables<'Vehicles'>['id'],
    Map<Tables<'VehicleExpenses'>['id'], Tables<'VehicleExpenses'>>
  >();

  const loading = ref(false);

  const expenses = computed(() => {
    if (!currentVehicle.value || !currentVehicle.value.id) {
      alert('No Vehicle Selected');

      return [];
    }

    if (!expensesCache.has(currentVehicle.value.id) && !loading.value) {
      getExpenses().then(retExpenses => {
        return retExpenses;
      });
    }

    const vehicleExpenses = expensesCache.get(currentVehicle.value.id);

    return vehicleExpenses ? Array.from(vehicleExpenses.values()) : [];
  });

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

      const currentVehicleExpensesCache =
        expensesCache.get(currentVehicle.value.id) || new Map();

      if (data) {
        data.forEach(item => {
          currentVehicleExpensesCache.set(item.id, item);
        });
      }

      expensesCache.set(currentVehicle.value.id, currentVehicleExpensesCache);

      return data ?? [];
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const upsertExpense = async (
    expense: TablesInsert<'VehicleExpenses'> | TablesUpdate<'VehicleExpenses'>,
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      loading.value = true;

      const { data, error } = await supabase
        .from('VehicleExpenses')
        .upsert({
          ...expense,
          vehicle_id: currentVehicle.value.id,
        })
        .select();

      if (error) {
        throw error;
      }

      const currentVehicleExpensesCache =
        expensesCache.get(currentVehicle.value.id) || new Map();

      if (data) {
        data.forEach(expense => {
          currentVehicleExpensesCache.set(expense.id, expense);
        });
      }

      expensesCache.set(currentVehicle.value.id, currentVehicleExpensesCache);
    } catch (pErr) {
      console.error(pErr);
    } finally {
      loading.value = false;
    }
  };

  const deleteExpense = async (expense_id: Tables<'VehicleExpenses'>['id']) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      loading.value = true;

      const { error } = await supabase
        .from('VehicleExpenses')
        .delete()
        .eq('id', expense_id);

      if (error) throw error;

      const currentVehicleExpensesCache =
        expensesCache.get(currentVehicle.value.id) || new Map();

      currentVehicleExpensesCache.delete(expense_id);

      expensesCache.set(currentVehicle.value.id, currentVehicleExpensesCache);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return { expenses, getExpenses, upsertExpense, deleteExpense, loading };
});
