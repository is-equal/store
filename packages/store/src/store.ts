import type {
  ListenerList,
  MiddlewareList,
  Store,
  StoreMutations,
  Middleware,
  RawMutations,
  StoreWithMutations,
  MiddlewareNextCommand,
} from './types';
import { compose, isFunction } from './tools';

export function createStore<Data>(initialData: Data): Store<Data> {
  let state: Data = structuredClone(initialData);
  const listeners: ListenerList<Data> = new Set();
  const middlewares: MiddlewareList<Data, RawMutations<Data>> = new Set();

  return {
    read() {
      return state;
    },
    write(value) {
      let nextValue: Data;

      // Necessary function validation because of issue: https://github.com/microsoft/TypeScript/issues/37663
      if (isFunction(value)) {
        nextValue = value(this.read());
      } else {
        nextValue = value;
      }

      state = structuredClone(nextValue);

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
    useMutations<Mutations extends RawMutations<Data>>(
      this: StoreWithMutations<Data, Mutations>,
      $mutations: Mutations
    ): StoreWithMutations<Data, Mutations> {
      Object.keys($mutations).forEach((type) => {
        const $store = this as StoreMutations<Data, Mutations>;

        $store[type as keyof Mutations] = createMutation(this, $mutations, middlewares, type);
      });

      return this;
    },
    useMiddleware<Mutations extends RawMutations<Data>>(
      this: StoreWithMutations<Data, Mutations>,
      fn: Middleware<Data, Mutations>
    ): StoreWithMutations<Data, Mutations> {
      const $middlewares = middlewares as MiddlewareList<Data, Mutations>;

      $middlewares.add(fn);

      return this;
    },
  };
}

function createMutation<Data, Mutations extends RawMutations<Data>, Action extends keyof Mutations>(
  store: StoreWithMutations<Data, Mutations>,
  mutations: Mutations,
  middlewares: MiddlewareList<Data, Mutations>,
  type: Action
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (payload: any) {
    if (middlewares.size > 0) {
      compose(...Array.from(middlewares).map((middleware) => middleware(store)))(commit)({
        type,
        payload,
      });
    } else {
      commit({ type, payload });
    }
  };

  function commit(command: MiddlewareNextCommand<Data, Mutations, Action>): void {
    const fn = mutations[command.type];

    store.write(fn(store.read(), command.payload));
  }
}
