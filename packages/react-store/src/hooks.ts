import { useSyncExternalStore } from 'react';
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

export function useStoreMutations<Store extends AnyStore>(store: Store): StoreMutations<Store> {
  return store as unknown as StoreMutations<Store>;
}

export function useStoreValue<Store extends AnyStore>(store: Store): StoreData<Store> {
  return useSyncExternalStore(store.subscribe, store.read);
}

type StoreSelector<Data, R = any> = (value: Data | undefined) => R;

export function useStoreSelector<
  Store extends AnyStore,
  Selector extends StoreSelector<StoreData<Store>>
>(store: Store, selector: Selector): ReturnType<Selector> {
  return useSyncExternalStore(store.subscribe, () => selector(store.read()));
}
