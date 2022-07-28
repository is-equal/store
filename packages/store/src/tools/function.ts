export function compose(...fns: any[]): any {
  return fns.reduce(
    (f: any, g: any) =>
      (...args: any[]) =>
        f(g(...args))
  );
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}
