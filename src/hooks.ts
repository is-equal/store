import { useCallback, useEffect, useRef, useState } from 'react';
import { isFunction } from './tools';
import type { Store, StoreData, StoreMutation, StoreSelector } from './types';

export function useStore<T>(store: Store<T>): [StoreData<T>, StoreMutation<T>] {
  const data = useStoreValue<T>(store);
  const mutation = useStoreMutation<T>(store);

  return [data, mutation];
}

export function useStoreValue<T>(store: Store<T>): StoreData<T> {
  const [, forceRender] = useState(true);
  const data = useRef(store.read());

  useEffect(() => {
    return store.subscribe((value) => {
      data.current = value;
      forceRender((next) => !next);
    });
  }, [store]);

  return data.current;
}

export function useStoreMutation<T>(store: Store<T>) {
  const mutation: StoreMutation<T> = useCallback(
    (data) => {
      let nextValue: T;

      // Necessary function validation because of issue: https://github.com/microsoft/TypeScript/issues/37663
      if (isFunction(data)) {
        nextValue = data(store.read());
      } else {
        nextValue = data;
      }

      store.write(nextValue);
    },
    [store]
  );

  return mutation;
}

export function useStoreSelector<T, Selector extends StoreSelector<T>>(
  store: Store<T>,
  selector: Selector
): ReturnType<Selector> {
  const [, forceRender] = useState(true);
  const data = useRef(selector(store.read()));

  useEffect(() => {
    return store.subscribe((value) => {
      const nextValue = selector(value);

      if (data.current === nextValue) {
        return;
      }

      data.current = nextValue;
      forceRender((next) => !next);
    });
  }, [store, selector]);

  return data.current;
}
