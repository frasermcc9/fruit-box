import { useMemo } from 'react';

export const useBoardStatistics = (board: number[]) => {
  return useMemo(() => {
    const appleCounts: Record<number, number> = {};

    let appleCount = 0;
    let appleSum = 0;

    for (const apple of board) {
      if (apple === 0) continue;
      appleCount++;
      appleSum += apple;
      appleCounts[apple] = (appleCounts[apple] || 0) + 1;
    }

    for (let i = 1; i < 10; i++) {
      appleCounts[i] = appleCounts[i] || 0;
    }

    const appleAverage = appleSum / appleCount;
    return { appleCounts, appleCount, appleSum, appleAverage };
  }, [board]);
};
