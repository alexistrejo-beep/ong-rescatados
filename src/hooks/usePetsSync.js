import { useCallback, useEffect, useState } from 'react';
import { isCloudStorageConfigured, supabase } from '../lib/supabase';

const CACHE_KEY = 'huellitas_animals';
const OUTBOX_KEY = 'huellitas_sync_outbox';
const TABLE_NAME = 'pets';

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // El cache es opcional: una cuota llena no debe impedir publicar.
  }
}

function toCloudRow(animal) {
  return {
    id: String(animal.id),
    data: animal,
    updated_at: new Date().toISOString()
  };
}

export default function usePetsSync(fallbackAnimals = []) {
  const [animals, setAnimals] = useState(() => readJson(CACHE_KEY, fallbackAnimals));
  const [isLoading, setIsLoading] = useState(isCloudStorageConfigured);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [syncError, setSyncError] = useState('');

  const persistCache = useCallback((nextAnimals) => {
    setAnimals(nextAnimals);
    writeJson(CACHE_KEY, nextAnimals);
  }, []);

  const queueOperation = useCallback((operation) => {
    const outbox = readJson(OUTBOX_KEY, []);
    writeJson(OUTBOX_KEY, [...outbox, operation]);
  }, []);

  const flushOutbox = useCallback(async () => {
    if (!supabase || !navigator.onLine) return;
    const outbox = readJson(OUTBOX_KEY, []);
    if (!outbox.length) return;

    try {
      for (const operation of outbox) {
        if (operation.type === 'delete') {
          const { error } = await supabase.from(TABLE_NAME).delete().eq('id', String(operation.id));
          if (error) throw error;
        } else {
          const { error } = await supabase.from(TABLE_NAME).upsert(toCloudRow(operation.animal));
          if (error) throw error;
        }
      }
      writeJson(OUTBOX_KEY, []);
      setSyncError('');
    } catch {
      setSyncError('Cambios guardados localmente. Se sincronizarán al recuperar la conexión.');
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushOutbox();
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushOutbox]);

  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;
    const loadCloudAnimals = async () => {
      const { data, error } = await supabase.from(TABLE_NAME).select('id,data').order('updated_at', { ascending: false });
      if (error) {
        if (isMounted) setSyncError('No se pudo conectar con la nube. Mostrando el último estado guardado.');
        setIsLoading(false);
        return;
      }

      const cloudAnimals = (data || []).map((row) => row.data).filter(Boolean);
      const cachedAnimals = readJson(CACHE_KEY, []);
      if (!cloudAnimals.length && cachedAnimals.length) {
        await Promise.all(cachedAnimals.map((animal) => supabase.from(TABLE_NAME).upsert(toCloudRow(animal))));
        if (isMounted) persistCache(cachedAnimals);
      } else if (isMounted) {
        persistCache(cloudAnimals);
      }
      await flushOutbox();
      if (isMounted) setIsLoading(false);
    };

    loadCloudAnimals();
    const channel = supabase
      .channel('pets-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, (payload) => {
        if (!isMounted) return;
        if (payload.eventType === 'DELETE') {
          setAnimals((current) => {
            const next = current.filter((animal) => String(animal.id) !== String(payload.old.id));
            writeJson(CACHE_KEY, next);
            return next;
          });
          return;
        }
        const incoming = payload.new?.data;
        if (!incoming) return;
        setAnimals((current) => {
          const next = [incoming, ...current.filter((animal) => String(animal.id) !== String(incoming.id))];
          writeJson(CACHE_KEY, next);
          return next;
        });
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [flushOutbox, persistCache]);

  const saveAnimal = useCallback(async (animal) => {
    persistCache([animal, ...animals.filter((item) => String(item.id) !== String(animal.id))]);
    if (!supabase || !navigator.onLine) {
      queueOperation({ type: 'upsert', animal });
      return;
    }
    const { error } = await supabase.from(TABLE_NAME).upsert(toCloudRow(animal));
    if (error) {
      queueOperation({ type: 'upsert', animal });
      setSyncError('Cambio guardado localmente. Se reintentará automáticamente.');
    }
  }, [animals, persistCache, queueOperation]);

  const removeAnimal = useCallback(async (id) => {
    persistCache(animals.filter((animal) => String(animal.id) !== String(id)));
    if (!supabase || !navigator.onLine) {
      queueOperation({ type: 'delete', id });
      return;
    }
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', String(id));
    if (error) {
      queueOperation({ type: 'delete', id });
      setSyncError('Eliminación guardada localmente. Se reintentará automáticamente.');
    }
  }, [animals, persistCache, queueOperation]);

  return { animals, isLoading, isOnline, syncError, saveAnimal, removeAnimal };
}