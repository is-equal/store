export type AnyFunction = (...args: any) => any;

/**
 * @internal
 */
export type ListenerList<Data> = Set<StoreListener<Data>>;

/**
 * @internal
 */
export type MiddlewareList<Data, Mutations extends RawMutations<Data>> = Set<
  Middleware<Data, Mutations>
>;

export interface StoreBase<Data> {
  read(): Data;
  /**
   * @internal
   */
  commit(value: Data): void;
  subscribe(fn: StoreListener<Data>): StoreUnsubscribe;
}

export type StoreListener<Data> = (value: Data) => void;

export type StoreUnsubscribe = () => void;

export type AnyStore = StoreBase<any>;

export type Store<Data> = StoreBase<Data> &
  Mutations<Data, RawMutations<Data>> &
  MutationExtension<Data> &
  MiddlewareExtension<Data, RawMutations<Data>>;

export interface RawMutations<Data> {
  [action: string]: (value: Data, payload: any) => Data;
}

export type Mutations<Data, BaseMutations extends RawMutations<Data>> = {
  [Action in keyof BaseMutations]: MutationFunction<Data, BaseMutations, Action>;
} & { write(value: Data | ((previousValue: Data) => Data)): void };

export type MutationFunction<
  Data,
  Mutations extends RawMutations<Data>,
  Action extends keyof Mutations
> = MutationPayload<Data, Mutations[Action]> extends void
  ? VoidFunction
  : (payload: MutationPayload<Data, Mutations[Action]>) => void;

export type MutationPayload<Data, T extends AnyFunction> = Parameters<T> extends [Data, infer U]
  ? U
  : void;

export interface MutationExtension<Data> {
  withMutations<Mutations extends RawMutations<Data>>(
    mutations: Mutations
  ): StoreWithMutations<Data, Mutations>;
}

export type StoreWithMutations<Data, BaseMutations extends RawMutations<Data>> = StoreBase<Data> &
  Mutations<Data, BaseMutations> &
  MiddlewareExtension<Data, BaseMutations>;

export interface MiddlewareExtension<Data, Mutations extends RawMutations<Data>> {
  useMiddleware(fn: Middleware<Data, Mutations>): this;
}

export type Middleware<Data, Mutations extends RawMutations<any>> = (
  store: StoreWithMutations<Data, Mutations>
) => (
  next: <NextAction extends keyof Mutations>(
    command: MiddlewareNextCommand<Data, Mutations, NextAction>
  ) => void
) => (command: MiddlewareCommand<Data, Mutations>) => void;

export type MiddlewareNextCommand<
  Data,
  Mutations extends RawMutations<Data>,
  Action extends keyof Mutations
> =
  | {
      type: Action;
      payload: MiddlewareCommandPayload<Mutations[Action]>;
    }
  | { type: 'write'; payload: Data };

export type MiddlewareCommand<Data, Mutations extends RawMutations<Data>> =
  | {
      [Action in keyof Mutations]: {
        type: Action;
        payload: MiddlewareCommandPayload<Mutations[Action]>;
      };
    }[keyof Mutations]
  | { type: 'write'; payload: Data | ((previousData: Data) => Data) };

export type MiddlewareCommandPayload<T extends AnyFunction> = Parameters<T> extends [
  any,
  infer Payload
]
  ? Payload
  : undefined;

export type StoreData<T extends AnyStore> = T extends StoreBase<infer Data> ? Data : never;

export type StoreMutations<S extends AnyStore> = S extends StoreWithMutations<
  infer Data,
  infer RawMutations
>
  ? Mutations<Data, RawMutations>
  : never;
