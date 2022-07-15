import type { Store, StoreListener } from './types';

export function createStore<T>(initialData: T): Store<T> {
  const listeners = new Set<StoreListener<T>>();
  let state = structuredClone(initialData);

  return {
    read() {
      return state;
    },
    write(value): void {
      state = structuredClone(value);

      for (const listener of listeners) {
        listener(state);
      }
    },
    subscribe(fn) {
      listeners.add(fn);

      return () => {
        listeners.delete(fn);
      };
    },
  };
}
