import type {
  MiddlewareList,
  RawMutations,
  StoreBase,
  StoreWithMutations,
  MiddlewareNextCommand,
  MutationFunction,
} from './types';
import { defineProperty, compose } from './tools';

export function injectMutationExtension<Data, Mutations extends RawMutations<Data>>(
  store: StoreBase<Data>,
  mutations: Mutations,
  middlewares: MiddlewareList<Data, Mutations>
): void {
  defineProperty(
    store,
    'write',
    createMutation('write', store as StoreWithMutations<Data, Mutations>, mutations, middlewares)
  );

  defineProperty(store, 'withMutations', withMutations, true);

  function withMutations($mutations: Mutations) {
    delete $mutations.write;

    Object.assign(mutations, $mutations);

    // @ts-expect-error: safe operations
    delete store.withMutations;

    injectMutations<Data, Mutations>(
      store as StoreWithMutations<Data, Mutations>,
      mutations,
      middlewares
    );

    return store;
  }
}

export function injectMutations<Data, Mutations extends RawMutations<Data>>(
  store: StoreWithMutations<Data, Mutations>,
  mutations: Mutations,
  middlewares: MiddlewareList<Data, Mutations>
) {
  for (const action in mutations) {
    if (action === 'write') {
      continue;
    }

    defineProperty(store, action, createMutation(action, store, mutations, middlewares));
  }
}

export function createMutation<
  Data,
  Mutations extends RawMutations<Data>,
  Action extends keyof Mutations
>(
  action: Action,
  store: StoreWithMutations<Data, Mutations>,
  mutations: Mutations,
  middlewares: MiddlewareList<Data, Mutations>
): MutationFunction<Data, Mutations, Action> {
  return function mutation(payload) {
    if (middlewares.size > 0) {
      const pipe = compose(...Array.from(middlewares).map((middleware) => middleware(store)));

      pipe(commit)({ type: action, payload });
    } else {
      commit({ type: action, payload } as MiddlewareNextCommand<Data, Mutations, Action>);
    }
  } as MutationFunction<Data, Mutations, Action>;

  function commit(command: MiddlewareNextCommand<Data, Mutations, Action>): void {
    const fn = mutations[command.type];

    store.commit(fn(store.read(), command.payload));
  }
}
