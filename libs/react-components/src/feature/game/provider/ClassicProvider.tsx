import { AppleGenerator } from '@apple-game/generation';
import { WeightedRandom } from '@apple-game/random';
import { SelectableGroup } from '@apple-game/react-drag-select';
import { useBoardStatistics, useCountdown } from '@apple-game/react-hooks';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BoardItemProps, SelectableBoardItem } from '../BoardItem';

export type ClassicProvided = Parameters<
  Parameters<typeof ClassicProvider>[0]['children']
>[0];

export const ClassicProvider = ({
  children,
}: {
  children: (args: {
    elements: JSX.Element[];
    disabled?: boolean;
    duringSelection: (selected: React.Component<BoardItemProps>[]) => void;
    onSelectionFinish: (selected: React.Component<BoardItemProps>[]) => void;
    ref: React.RefObject<SelectableGroup>;
    score: number;
    appleAverage: number;
    appleCount: number;
    appleCounts: Record<number, number>;
    appleSum: number;
    remainingTime: number;
    initialTime: number;
  }) => JSX.Element;
}) => {
  const selectionRef = useRef<SelectableGroup>(null);

  const [board, setBoard] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const { appleAverage, appleCount, appleCounts, appleSum } =
    useBoardStatistics(board);

  useEffect(() => {
    setTimeout(() => {
      const apples = AppleGenerator.generateClassic({
        generator: new WeightedRandom([0, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
        size: 170,
      });
      setBoard(apples);
    }, 1);
  }, []);

  const getVisibleApples = useCallback(
    (selected: React.Component<BoardItemProps>[]) =>
      selected.filter((a) => a.props.value !== 0),
    [],
  );

  const getSum = useCallback(
    (selected: React.Component<BoardItemProps>[]) =>
      selected.reduce((a, b) => a + b.props.value, 0),
    [],
  );

  const applyVisibility = useCallback((selectBox: HTMLDivElement) => {
    if (selectBox?.style.width === '0px') {
      selectBox.style.visibility = 'hidden';
    } else {
      selectBox.style.visibility = 'visible';
    }
  }, []);

  const handleSelect = useCallback(
    (selected: React.Component<BoardItemProps>[]) => {
      const selectBox = document
        .getElementsByClassName('selectable-selectbox')
        .item(0) as HTMLDivElement;

      applyVisibility(selectBox);

      const visibleApples = getVisibleApples(selected);
      const total = getSum(visibleApples);

      if (total !== 10) {
        return;
      }

      const selectedCount = visibleApples.length;

      const appleIds = visibleApples.map((apple) => apple.props.id);
      const boardToUpdate = board.slice();

      for (const id of appleIds) {
        boardToUpdate[id] = 0;
      }

      setBoard(boardToUpdate);
      setScore((oldScore) => oldScore + selectedCount);
    },
    [applyVisibility, board, getSum, getVisibleApples],
  );

  const handleDuring = useCallback(
    (selected: React.Component<BoardItemProps>[]) => {
      const visibleApples = getVisibleApples(selected);
      const total = getSum(visibleApples);

      const selectBox = document
        .getElementsByClassName('selectable-selectbox')
        .item(0) as HTMLDivElement;

      applyVisibility(selectBox);

      if (total === 10) {
        selectBox?.classList.add('selectable-selectbox-valid');
        selectBox?.classList.remove('selectable-selectbox-partial');
      } else {
        selectBox?.classList.add('selectable-selectbox-partial');
        selectBox?.classList.remove('selectable-selectbox-valid');
      }
    },
    [applyVisibility, getSum, getVisibleApples],
  );

  const initialTime = useMemo(() => 120000, []);

  const { startCountdown, remainingTime } = useCountdown({
    initialDurationMs: initialTime,
    updateFrequencyMs: 50,
    onEnd() {
      console.log('test');
    },
  });

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  return children({
    disabled: false,
    duringSelection: handleDuring,
    onSelectionFinish: handleSelect,
    elements: board.map((value, index) => (
      <SelectableBoardItem key={index} id={index} value={value} />
    )),
    ref: selectionRef,
    score,
    appleAverage,
    appleCount,
    appleCounts,
    appleSum,
    remainingTime,
    initialTime,
  });
};
