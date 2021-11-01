import React, { useEffect, useRef } from "react";
import { ReactComponent as AppleImg } from "../../res/apple.svg";
import { ReactComponent as AmongUsImg } from "../../res/amogus.svg";
import { TSelectableItemProps, createSelectable } from "react-selectable-fast";

interface BaseProps {
  value: number;
  id: number;
}

type AppleProps = TSelectableItemProps & BaseProps;

const Apple: React.FC<AppleProps> = ({
  value,
  isSelected,
  isSelecting,
  selectableRef,
  id,
}) => {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current?.getElementById("apple-path");
    if (isSelecting) {
      el?.classList.add("selected");
    } else {
      el?.classList.remove("selected");
    }
  }, [isSelecting]);

  return (
    <div
      className="w-full h-full max-h-24 p-1 flex justify-center items-center"
      ref={selectableRef}
    >
      {value !== 0 && (
        <>
          <AppleImg
            ref={svg}
            className="w-full h-full fill-current text-red-500 dark:text-red-700"
          />
          <div className="absolute text-white font-bold text-3xl select-none mt-1">
            {value}
          </div>
        </>
      )}
    </div>
  );
};

const SelectableApple = createSelectable(Apple);

export default SelectableApple;
export type { AppleProps };
