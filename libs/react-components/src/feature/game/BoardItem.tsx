import React, { ComponentType, useEffect, useRef } from 'react';
import {
  TSelectableItemProps,
  createSelectable,
} from '@apple-game/react-drag-select';
import { ReactComponent as AppleImg } from '../../res/apple.svg';

interface BaseProps {
  value: number;
  id: number;
  color?: string;
  displayOverride?: string;
}

export type BoardItemProps = TSelectableItemProps & BaseProps;

const BoardItem = ({
  value,
  isSelected,
  isSelecting,
  selectableRef,
  id,
  color = 'text-red-500 dark:text-red-700',
  displayOverride,
}: BoardItemProps) => {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current?.getElementById('apple-path');
    if (isSelecting) {
      el?.classList.add('selected');
    } else {
      el?.classList.remove('selected');
    }
  }, [isSelecting]);

  return (
    <div
      className="flex h-full max-h-24 w-full max-w-[4rem] items-center justify-center p-[1px]"
      ref={selectableRef}
    >
      {value !== 0 && (
        <>
          <AppleImg
            ref={svg}
            className={`h-full w-full fill-current ${color}`}
          />
          <div className="absolute mt-[6px] select-none text-2xl font-bold text-white sm:mt-1 sm:text-3xl">
            {displayOverride ? displayOverride : value}
          </div>
        </>
      )}
    </div>
  );
};

const SelectableBoardItem = createSelectable(BoardItem);

type TSelectableBoardItem = ComponentType<
  BaseProps & Partial<Pick<TSelectableItemProps, 'isSelected'>>
>;

export { SelectableBoardItem, TSelectableBoardItem };
