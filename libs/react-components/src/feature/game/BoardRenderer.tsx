import { SelectableGroup } from '@apple-game/react-drag-select';
import { forwardRef, useLayoutEffect } from 'react';
import { BoardStatistics } from './BoardStatistics';
import { ClassicProvided } from './provider';
import { Timer } from './Timer';

type BoardRendererProps = ClassicProvided;

export const BoardRenderer = forwardRef<SelectableGroup, BoardRendererProps>(
  (
    {
      elements,
      disabled,
      duringSelection,
      onSelectionFinish,
      score,
      appleAverage,
      appleCounts,
      appleSum,
      remainingTime,
      initialTime,
    }: BoardRendererProps,
    ref,
  ) => {
    useLayoutEffect(() => {
      const selectBox = document
        .getElementsByClassName('selectable-selectbox')
        .item(0) as HTMLDivElement;
      selectBox?.classList.add('selectable-selectbox-partial');
      selectBox.style.visibility = 'hidden';
    }, []);

    return (
      <div className="mx-auto flex flex-col items-center rounded-lg bg-emerald-500 p-4 dark:bg-emerald-600">
        <div className="mb-3 flex w-full items-center justify-around gap-x-8">
          <Timer timeRemaining={remainingTime} maxTime={initialTime} />
          <div className="text-2xl font-bold">{score}</div>
          <Timer timeRemaining={remainingTime} maxTime={initialTime} reversed />
        </div>
        <div className="rounded-lg bg-zinc-200 p-4 dark:bg-zinc-700">
          <SelectableGroup
            resetOnStart
            tolerance={20}
            ref={ref}
            onSelectionFinish={onSelectionFinish}
            duringSelection={duringSelection}
            disabled={disabled}
          >
            <div className="md:grid-cols-17 mx-auto grid grid-cols-10">
              {elements.map((element) => element)}
            </div>
          </SelectableGroup>
        </div>
        <BoardStatistics
          appleAverage={appleAverage}
          appleCounts={appleCounts}
          appleSum={appleSum}
        />
      </div>
    );
  },
);
