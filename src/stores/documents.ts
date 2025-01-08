import { computed, reactive, ref, toRef } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

// TODO: fix documents to be uploaded in folder by ID instead of license plate?

interface FileOptions {
  /**
   * The number of seconds the asset is cached in the browser and in the Supabase CDN. This is set in the `Cache-Control: max-age=<seconds>` header. Defaults to 3600 seconds.
   */
  cacheControl?: string;
  /**
   * the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
   */
  contentType?: string;
  /**
   * When upsert is set to true, the file is overwritten if it exists. When set to false, an error is thrown if the object already exists. Defaults to false.
   */
  upsert?: boolean;
  /**
   * The duplex option is a string parameter that enables or disables duplex streaming, allowing for both reading and writing data in the same stream. It can be passed as an option to the fetch() method.
   */
  duplex?: string;

  /**
   * The metadata option is an object that allows you to store additional information about the file. This information can be used to filter and search for files. The metadata object can contain any key-value pairs you want to store.
   */
  metadata?: Record<string, unknown>;

  /**
   * Optionally add extra headers
   */
  headers?: Record<string, string>;
}

export const useDocumentsStore = defineStore('documents', () => {
  const vehiclesStore = useVehiclesStore();
  const currentVehicle = toRef(vehiclesStore, 'currentVehicle');
  const { setCurrentVehicle } = vehiclesStore;

  const documentsCache = reactive(
    new Map<
      Tables<'Vehicles'>['id'],
      Map<Tables<'VehicleDocuments'>['id'], Tables<'VehicleDocuments'>>
    >(),
  );

  const loading = ref(false);

  const documents = computed(() => {
    if (!currentVehicle.value || !currentVehicle.value.id) {
      setCurrentVehicle();

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

  const uploadDocumentFile = async (
    path: string,
    file: File,
    options?: FileOptions,
  ) => {
    try {
      const { data, error } = await supabase.storage
        .from('VehicleDocuments')
        .upload(path, file, options);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(error);
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
    uploadDocumentFile,
    bindDocumentToService,
    deleteDocumentFile,
    loading,
  };
});
