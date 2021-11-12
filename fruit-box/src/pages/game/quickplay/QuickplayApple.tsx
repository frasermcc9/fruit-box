import React, { useEffect, useRef } from "react";
import { ReactComponent as AppleImg } from "../../../res/apple.svg";
import { TSelectableItemProps, createSelectable } from "react-selectable-fast";
import { Entity } from "./modifier";

interface BaseProps {
  apple: Entity;
}

type QuickplayAppleProps = TSelectableItemProps & BaseProps;

const QuickplayApple: React.FC<QuickplayAppleProps> = ({
  apple,
  isSelected,
  isSelecting,
  selectableRef,
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

  const displayOverride = apple.getTextOverride();

  return (
    <div
      className="w-full h-full max-h-24 md:p-1 p-[1px] flex justify-center items-center"
      ref={selectableRef}
    >
      {apple.isVisible() && (
        <>
          <AppleImg
            ref={svg}
            className={`w-full h-full fill-current ${apple.getColor()}`}
          />
          <div className="absolute text-white font-bold text-xl sm:text-3xl select-none sm:mt-1 mt-[2px]">
            {displayOverride ? displayOverride : apple.getBaseValue()}
          </div>
        </>
      )}
    </div>
  );
};

const SelectableQuickplayApple = createSelectable(QuickplayApple);

export default SelectableQuickplayApple;
export type { QuickplayAppleProps };
