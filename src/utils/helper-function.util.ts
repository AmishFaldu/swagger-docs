import { DeepWritable } from "../interfaces/types/deep-writable.type";

/**
 * Evaluates and returns javascript object keys inside another object
 * @param object - Outer object to look into for object keys
 * @returns array of keys (string) which are javascript object
 */
const objectKeys = (object: Readonly<Record<string, unknown>>): string[] => {
  return Object.keys(object).filter((key) => {
    return typeof object[key] === typeof {};
  });
};

/**
 * Deep copy javascript object
 * Reference banchmark - https://jsben.ch/kczB2
 */
export const deepCopyObject = <T>(
  object: { [K in keyof T]: T[K] },
): DeepWritable<T> => {
  const deepCloneObject = { ...object };
  const keys = objectKeys(deepCloneObject);
  keys.forEach((key) => {
    deepCloneObject[key] = deepCopyObject(deepCloneObject[key]);
  });

  return deepCloneObject as DeepWritable<T>;
};
