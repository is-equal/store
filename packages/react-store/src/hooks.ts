import { useEffect, useRef, useState } from 'react';
import type { AnyStore, StoreMutations, StoreData } from '@equal/store';

export function useStore<Store extends AnyStore>(
  store: Store
): [StoreData<Store>, StoreMutations<Store>] {
  const data = useStoreValue(store);
  const mutations = useStoreMutations(store);

  return [data, mutations];
}

export function useStoreSubscriber<Store extends AnyStore>(store: Store): void {
  useStoreValue(store);
}

export function useStoreMutations<Store extends AnyStore, Mutations extends StoreMutations<Store>>(
  store: Store
): Mutations {
  return store as unknown as Mutations;
}

export function useStoreValue<Store extends AnyStore>(store: Store): StoreData<Store> {
  const [, forceRender] = useState(true);
  const data = useRef<StoreData<Store>>(store.read());

  useEffect(() => {
    return store.subscribe(function storeListener(value) {
      if (Object.is(data.current, value)) {
        return;
      }

      data.current = value;
      forceRender((next) => !next);
    });
  }, [store]);

  return data.current;
}

type StoreSelector<Data, R = any> = (value: Data | undefined) => R;

export function useStoreSelector<
  Store extends AnyStore,
  Selector extends StoreSelector<StoreData<Store>>
>(store: Store, selector: Selector): ReturnType<Selector> {
  const [, forceRender] = useState(true);
  const data = useRef<ReturnType<Selector>>(selector(store.read()));

  useEffect(() => {
    return store.subscribe(function storeListener(value) {
      const nextValue = selector(value);

      if (Object.is(data.current, nextValue)) {
        return;
      }

      data.current = nextValue;
      forceRender((next) => !next);
    });
  }, [store, selector]);

  return data.current;
}
