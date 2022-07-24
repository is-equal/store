/* eslint-disable @typescript-eslint/no-explicit-any */

export type AnyFunction = (...args: any) => any;

export type AnyStore = Store<any> | StoreWithMutations<any, RawMutations<any>>;

export type ListenerList<Data> = Set<StoreListener<Data>>;

export type MiddlewareList<Data, Mutations extends RawMutations<Data>> = Set<Middleware<Data, Mutations>>;

export interface Store<Data> {
  read: () => Data;
  write: (value: Data) => void;
  subscribe(fn: StoreListener<Data>): StoreUnsubscribe;
  useMutations<Mutations extends RawMutations<Data>>(mutations: Mutations): StoreWithMutations<Data, Mutations>;
  useMiddleware<Mutations extends RawMutations<Data>>(
    this: StoreWithMutations<Data, Mutations>,
    fn: Middleware<Data, Mutations>
  ): StoreWithMutations<Data, Mutations>;
}

export type StoreWithMutations<Data, Mutations extends RawMutations<Data>> = Store<Data> &
  StoreMutations<Data, Mutations>;

export type StoreListener<Data> = (value: Data) => void;

export type StoreUnsubscribe = () => void;

export type StoreMutations<Data, Mutations extends RawMutations<Data>> = {
  [Action in keyof Mutations]: (payload: MutationPayload<Data, Mutations[Action]>) => void;
};

export interface RawMutations<Data> {
  [action: string]: (value: Data, payload: any) => Data;
}

export type MutationPayload<Data, T extends AnyFunction> = Parameters<T> extends [Data, infer U] ? U : void;

export type Middleware<Data, Mutations extends RawMutations<any>> = (
  store: StoreWithMutations<Data, Mutations>
) => (
  next: <NextAction extends keyof Mutations>(command: MiddlewareNextCommand<Data, Mutations, NextAction>) => void
) => (command: MiddlewareCommand<Data, Mutations>) => void;

export type MiddlewareNextCommand<Data, Mutations extends RawMutations<Data>, Action extends keyof Mutations> = {
  type: Action;
  payload: MiddlewareCommandPayload<Mutations[Action]>;
};

export type MiddlewareCommand<Data, Mutations extends RawMutations<Data>> = {
  [Action in keyof Mutations]: {
    type: Action;
    payload: MiddlewareCommandPayload<Mutations[Action]>;
  };
}[keyof Mutations];

export type MiddlewareCommandPayload<T extends AnyFunction> = Parameters<T> extends [any, infer Payload]
  ? Payload
  : undefined;
