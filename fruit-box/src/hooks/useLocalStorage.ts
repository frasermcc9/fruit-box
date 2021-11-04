import { useEffect } from "react";

export const useLocalStorageOnLoad = <T>(
  key: string,
  fn?: (value: T) => void
) => {
  useEffect(() => {
    const value = localStorage.getItem(key);
    if (value && fn) {
      fn(JSON.parse(value));
    }
  }, []);

  const set = (value: T) => {
    console.log(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return set;
};
