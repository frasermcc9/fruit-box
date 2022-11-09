import { useCallback, useEffect, useState } from 'react';
import { DateTime } from 'luxon';

export const useCountdown = ({
  initialDurationMs,
  updateFrequencyMs,
  onEnd,
}: {
  initialDurationMs: number;
  updateFrequencyMs: number;
  onEnd?: () => void;
}) => {
  const [remainingTime, setRemainingTime] = useState(initialDurationMs);
  const [isRunning, setIsRunning] = useState(false);

  const [endDateTime, setEndDateTime] = useState<DateTime>();

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        if (!endDateTime) return;

        const now = DateTime.now();
        const newRemainingTime = endDateTime.diff(now).as('milliseconds');
        setRemainingTime(newRemainingTime);

        if (newRemainingTime <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          onEnd?.();
        }
      }, updateFrequencyMs);

      return () => clearInterval(interval);
    }
    return () => null;
  }, [endDateTime, isRunning, onEnd, updateFrequencyMs]);

  const startCountdown = useCallback(() => {
    if (remainingTime <= 0) return;

    setEndDateTime(DateTime.now().plus({ milliseconds: remainingTime }));
    setIsRunning(true);
  }, [remainingTime]);

  const stopCountdown = useCallback(() => {
    setIsRunning(false);
  }, []);

  return { isRunning, startCountdown, stopCountdown, remainingTime };
};
