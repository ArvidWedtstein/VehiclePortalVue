import { computed, reactive, ref, toRef } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

// type VehicleDocument = Tables<'VehicleDocuments'> & {
//   path: string | null;
//   signedUrl: string;
// };

export const useDocumentsStore = defineStore('documents', () => {
  const vehiclesStore = useVehiclesStore();
  const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

  const documentsCache = reactive(
    new Map<
      Tables<'Vehicles'>['id'],
      Map<Tables<'VehicleDocuments'>['id'], Tables<'VehicleDocuments'>>
    >(),
  );

  const loading = ref(false);

  const documents = computed(() => {
    if (!currentVehicle.value || !currentVehicle.value.id) {
      alert('No Vehicle Selected');

      return [];
    }

    if (!documentsCache.has(currentVehicle.value.id) && !loading.value) {
      getDocuments();
    }

    const vehicleDocuments = documentsCache.get(currentVehicle.value.id);

    return vehicleDocuments ? Array.from(vehicleDocuments.values()) : [];
  });

  const getDocuments = async <
    Columns extends (keyof Tables<'VehicleDocuments'> | '*')[],
  >(
    filters?: FilterKeys<Tables<'VehicleDocuments'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      loading.value = true;

      const { data, error, status } = await supabase
        .from('VehicleDocuments')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.value.id)
        .limit(100)
        .returns<Tables<'VehicleDocuments'>[]>();

      if (error && status !== 406) throw error;

      // TODO: remove this.
      // const { data: bucketData, error: bucketError } = await supabase.storage
      //   .from('VehicleDocuments')
      //   .createSignedUrls(
      //     files.map(
      //       ({ name }) => `${currentVehicle.licenseplate_number}/${name || ''}`,
      //     ),
      //     5000,
      //   );

      // if (bucketError) throw bucketError;

      // if (bucketData) {
      //   console.log(bucketData);
      // }

      // const filesWithBucketData = files.map(file => {
      //   const bFile = bucketData.find(({ path }) =>
      //     path?.includes(file.name || ''),
      //   );

      //   return {
      //     ...file,
      //     path: bFile?.path || '',
      //     signedUrl: bFile?.signedUrl || '',
      //   };
      // });

      const vehicleDocumentsCache =
        documentsCache.get(currentVehicle.value.id) || new Map();

      if (data) {
        data.forEach(item => {
          vehicleDocumentsCache.set(item.id, item);
        });
      }

      documentsCache.set(currentVehicle.value.id, vehicleDocumentsCache);
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const bindDocumentToService = async (
    document_path: Tables<'VehicleDocuments'>['file_path'],
    service_id: Tables<'VehicleServiceLogs'>['id'],
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      loading.value = true;

      const { data, error, status } = await supabase
        .from('VehicleDocuments')
        .update({
          service_log_id: service_id,
        })
        .eq('file_path', document_path)
        .select();

      if (error && status !== 406) throw error;

      const currentVehicleDocumentsCache =
        documentsCache.get(currentVehicle.value.id) || new Map();

      data?.forEach(item => {
        currentVehicleDocumentsCache.set(item.id, item);
      });

      documentsCache.set(currentVehicle.value.id, currentVehicleDocumentsCache);

      return data;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deleteDocumentFile = async (filePaths: Array<string>) => {
    try {
      if (!filePaths.length) return;

      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      const { data, error } = await supabase.storage
        .from('VehicleDocuments')
        .remove(filePaths);

      const currentVehicleDocumentsCache =
        documentsCache.get(currentVehicle.value.id) ||
        (new Map() as Map<
          Tables<'VehicleDocuments'>['id'],
          Tables<'VehicleDocuments'>
        >);

      data?.forEach(item => {
        const cacheEntry = Array.from(
          currentVehicleDocumentsCache.values(),
        ).find(f => f.name === item.name);
        if (!cacheEntry) return;
        currentVehicleDocumentsCache.delete(cacheEntry.id);
      });

      documentsCache.set(currentVehicle.value.id, currentVehicleDocumentsCache);

      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    documents,
    getDocuments,
    bindDocumentToService,
    deleteDocumentFile,
    loading,
  };
});
