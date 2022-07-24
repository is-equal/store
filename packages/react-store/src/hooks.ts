/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react';
import type { AnyStore, StoreWithMutations, Store } from '@equal/store';

type StoreData<S extends AnyStore> = S extends Store<infer Data>
  ? Data
  : S extends StoreWithMutations<infer Data, any>
  ? Data
  : never;

type StoreSelector<Data, R = any> = (value: Data | undefined) => R;

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

export function useStoreSelector<Store extends AnyStore, Selector extends StoreSelector<StoreData<Store>>>(
  store: Store,
  selector: Selector
): ReturnType<Selector> {
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
