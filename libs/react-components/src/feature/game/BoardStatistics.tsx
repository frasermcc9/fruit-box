export const BoardStatistics = ({
  appleAverage,
  appleCounts,
  appleSum,
}: {
  appleAverage: number;
  appleCounts: Record<number, number>;
  appleSum: number;
}) => {
  return (
    <div className="flex w-full items-center justify-around gap-x-4">
      <div className="text-center text-xs font-normal md:text-lg md:font-semibold">
        Average Apple Value: {appleAverage.toFixed(2)}
      </div>
      <div className="mt-2 grid grid-cols-9 gap-0.5 border-2 bg-zinc-50 text-xs md:text-2xl">
        {Object.keys(appleCounts).map((key) => (
          <div
            key={key}
            className="h-4 w-4 bg-emerald-500 text-center font-bold dark:bg-emerald-600 md:h-8 md:w-8"
          >
            {key}
          </div>
        ))}
        {Object.values(appleCounts).map((val, index) => (
          <div
            key={index}
            className="h-4 w-4 bg-emerald-500 text-center dark:bg-emerald-600 md:m-0 md:h-8 md:w-8"
          >
            {val}
          </div>
        ))}
      </div>
      <div className="text-center text-xs font-normal md:text-lg md:font-semibold">
        Total Apple Value: {appleSum}
      </div>
    </div>
  );
};
