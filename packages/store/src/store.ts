import type { Store, StoreBase, MiddlewareList, ListenerList } from './types';
import { isFunction } from './tools';
import { injectMutationExtension } from './mutation';
import { injectMiddlewareExtension } from './middleware';
import type { RawMutations } from './types';

export function createStore<Data>(initialData: Data | (() => Data)): Store<Data> {
  // Necessary function validation because of issue: https://github.com/microsoft/TypeScript/issues/37663
  let state: Data = structuredClone(isFunction(initialData) ? initialData() : initialData);

  const listeners: ListenerList<Data> = new Set();
  const mutations: RawMutations<Data> = {
    write(value: Data, payload: Data | ((previousData: Data) => Data)) {
      if (isFunction(payload)) {
        return payload(state);
      }

      return payload;
    },
  };

  const middlewares: MiddlewareList<Data, RawMutations<Data>> = new Set();

  const store: StoreBase<Data> = {
    read() {
      return state;
    },
    commit(value) {
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

  Object.defineProperties(store, {
    read: {
      enumerable: false,
      configurable: false,
      writable: false,
    },
    commit: {
      enumerable: false,
      configurable: false,
      writable: false,
    },
    subscribe: {
      enumerable: false,
      configurable: false,
      writable: false,
    },
  });

  injectMutationExtension(store, mutations, middlewares);
  injectMiddlewareExtension(store, mutations, middlewares);

  return store as Store<Data>;
}
