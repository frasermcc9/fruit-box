import React, { useEffect, useRef } from "react";
import { ReactComponent as AppleImg } from "../../res/apple.svg";
import { ReactComponent as AmongUsImg } from "../../res/amogus.svg";
import { TSelectableItemProps, createSelectable } from "react-selectable-fast";

interface BaseProps {
  value: number;
  id: number;
  color?: string;
  displayOverride?: string;
}

type AppleProps = TSelectableItemProps & BaseProps;

const Apple: React.FC<AppleProps> = ({
  value,
  isSelected,
  isSelecting,
  selectableRef,
  id,
  color = "text-red-500 dark:text-red-700",
  displayOverride,
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
      className="w-full h-full max-h-24 md:p-1 p-[1px] flex justify-center items-center"
      ref={selectableRef}
    >
      {value !== 0 && (
        <>
          <AppleImg
            ref={svg}
            className={`w-full h-full fill-current ${color}`}
          />
          <div className="absolute text-white font-bold text-xl sm:text-3xl select-none sm:mt-1 mt-[2px]">
            {displayOverride ? displayOverride : value}
          </div>
        </>
      )}
    </div>
  );
};

const SelectableApple = createSelectable(Apple);

export default SelectableApple;
export type { AppleProps };
