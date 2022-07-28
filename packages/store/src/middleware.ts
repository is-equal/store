import type { Middleware, MiddlewareList, RawMutations, StoreBase } from './types';
import { defineProperty } from './tools';

export function injectMiddlewareExtension<Data, Mutations extends RawMutations<Data>>(
  store: StoreBase<Data>,
  mutations: Mutations,
  middlewares: MiddlewareList<Data, Mutations>
): void {
  defineProperty(store, 'useMiddleware', useMiddleware);

  function useMiddleware(fn: Middleware<Data, Mutations>) {
    middlewares.add(fn);

    return store;
  }
}
