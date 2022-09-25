/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

export type Primitive = bigint | boolean | number | string | symbol | null | undefined;
export type Builtin = Date | Error | Function | Primitive | RegExp;
export type IsTuple<T> = T extends any[] ? (any[] extends T ? never : T) : never;
export type IsAny<T> = 0 extends T & 1 ? true : false;
export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false;
export type AnyArray<T = any> = Array<T> | ReadonlyArray<T>;

export type DeepWritable<T> = T extends Builtin
  ? T
  : T extends ReadonlyMap<infer K, infer V>
  ? Map<DeepWritable<K>, DeepWritable<V>>
  : T extends Map<infer K, infer V>
  ? Map<DeepWritable<K>, DeepWritable<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepWritable<K>, DeepWritable<V>>
  : T extends ReadonlySet<infer U>
  ? Set<DeepWritable<U>>
  : T extends Set<infer U>
  ? Set<DeepWritable<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepWritable<U>>
  : T extends Promise<infer U>
  ? Promise<DeepWritable<U>>
  : T extends AnyArray<infer U>
  ? T extends IsTuple<T>
    ? { -readonly [K in keyof T]: DeepWritable<T[K]> }
    : Array<DeepWritable<U>>
  : T extends {}
  ? { -readonly [K in keyof T]: DeepWritable<T[K]> }
  : IsUnknown<T> extends true
  ? unknown
  : T;
