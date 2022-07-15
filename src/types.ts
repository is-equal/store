type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export interface Store<T> {
  read: () => StoreData<T>;
  write: (value: T) => void;
  subscribe: (fn: StoreListener<T>) => StoreUnsubscribe;
}

export type StoreData<T> = DeepReadonly<T>;

export type StoreListener<T> = (value: T) => void;

export type StoreUnsubscribe = () => void;

export type StoreMutation<T> = (value: T | ((previousData: StoreData<T>) => T)) => void;

export type StoreSelector<T> = (value: StoreData<T>) => any;
