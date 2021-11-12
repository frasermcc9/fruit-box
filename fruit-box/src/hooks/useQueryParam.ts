import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export function useQueryParam<T>(key: string) {
  const { search } = useLocation();

  const [val, setVal] = useState<T>(() => {
    const params = new URLSearchParams(search);
    const value = params.get(key);
    return JSON.parse(value ?? "");
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    const value = params.get(key);
    if (value) {
      setVal(JSON.parse(value) as T);
    }
  }, [key, search]);

  return val;
}
