import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

type VehicleDocument = Tables<'VehicleDocuments'> & {
  path: string | null;
  signedUrl: string;
};
export const useDocumentsStore = defineStore('documents', () => {
  const { currentVehicle } = useVehiclesStore();
  const documents = ref<VehicleDocument[]>([]);
  const documentsCache = new Map<number, VehicleDocument[]>();

  const getDocuments = async <
    Columns extends (keyof Tables<'VehicleDocuments'> | '*')[],
  >(
    filters?: FilterKeys<Tables<'VehicleDocuments'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      if (!currentVehicle || !currentVehicle.id) {
        throw new Error('No Vehicle Selected!');
      }

      if (
        documents.value.filter(
          ({ vehicle_id }) => vehicle_id === currentVehicle.id,
        ).length > 0 ||
        documentsCache.has(currentVehicle.id)
      )
        return;

      const { data, error, status } = await supabase
        .from('VehicleDocuments')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.id)
        .limit(100)
        .returns<Tables<'VehicleDocuments'>[]>();

      if (error && status !== 406) throw error;

      const files = data ?? [];

      const { data: bucketData, error: bucketError } = await supabase.storage
        .from('VehicleDocuments')
        .createSignedUrls(
          files.map(
            ({ name }) => `${currentVehicle.licenseplate_number}/${name || ''}`,
          ),
          5000,
        );

      if (bucketError) throw bucketError;

      if (bucketData) {
        console.log(bucketData);
      }

      const filesWithBucketData = files.map(file => {
        const bFile = bucketData.find(({ path }) =>
          path?.includes(file.name || ''),
        );

        return {
          ...file,
          path: bFile?.path || '',
          signedUrl: bFile?.signedUrl || '',
        };
      });

      documentsCache.set(currentVehicle.id, filesWithBucketData);
      documents.value = filesWithBucketData;
    } catch (pErr) {
      console.error(pErr);
    }
  };

  return { documents, getDocuments };
});
