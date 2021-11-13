import { useEffect, useState } from "react";

export const useMediaQuery = <T, F>(
  query: string,
  whenTrue: T,
  whenFalse: F
) => {
  const mediaQuery = window.matchMedia(query);
  const [match, setMatch] = useState(!!mediaQuery.matches);

  useEffect(() => {
    const handler = () => setMatch(!!mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [mediaQuery]);

  return match ? whenTrue : whenFalse;
};
