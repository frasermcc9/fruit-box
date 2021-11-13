import { useEffect, useState } from "react";

export function usePollingEffect(
  callback: () => void,
  interval: number,
  deps: any[]
) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      callback();
      forceUpdate(0);
    }, interval);

    return () => clearInterval(intervalId);
  }, [...deps]);
}
