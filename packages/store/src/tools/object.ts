export function defineProperty(obj: object, key: string, value: unknown, removable = false) {
  Object.defineProperty(obj, key, {
    value,
    enumerable: true,
    configurable: removable,
    writable: false,
  });
}
