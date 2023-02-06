import { Nullable } from '../types/utils';

const keyPrefix = (process.env['NEXT_PUBLIC_APP_NAME'] ? process.env['NEXT_PUBLIC_APP_NAME'] + '_' : '') +
  process.env['NODE_ENV'] + '::';

export const clientStorage = {
  set<T = any>(key: string, value: T): boolean {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(keyPrefix + key, json);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  get<T = any>(key: string): Nullable<T> {
    try {
      const json = localStorage.getItem(keyPrefix + key);

      if (json == null) {
        return null;
      }

      return JSON.parse(json);
    } catch (err) {
      return null;
    }
  },
  remove(key: string): boolean {
    try {
      localStorage.removeItem(keyPrefix + key);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};