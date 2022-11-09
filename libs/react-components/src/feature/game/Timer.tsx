import classNames from 'classnames';
import { useMemo } from 'react';

export const Timer = ({
  timeRemaining,
  maxTime,
  reversed,
}: {
  timeRemaining: number;
  maxTime: number;
  reversed?: boolean;
}) => {
  const width = useMemo(
    () => Math.max((timeRemaining / maxTime) * 100, 0),
    [timeRemaining, maxTime],
  );

  return (
    <div
      className={classNames(
        'w-full rounded-full bg-zinc-200 p-1.5 transition-colors dark:bg-zinc-800',
        {
          '-scale-x-100': reversed,
        },
      )}
    >
      <div className="overflow-hidden rounded-full">
        <div
          className="h-4 rounded-full bg-emerald-500 transition-transform ease-linear"
          style={{ transform: `translateX(${100 - width}%)` }}
        />
      </div>
    </div>
  );
};
