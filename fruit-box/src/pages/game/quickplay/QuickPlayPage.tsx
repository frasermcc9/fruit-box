import React, { useEffect, useLayoutEffect, useState } from "react";
import { SelectableGroup } from "react-selectable-fast";
import Apple, { AppleProps } from "../Apple";
import GenericBoard from "../board/GenericBoard";
import ProgressBar from "../progress/ProgressBar";

interface Props {
  goalValue?: number;
}

const QuickPlayPage: React.FC<Props> = ({ goalValue = 10 }) => {
  const selectionRef = React.useRef<SelectableGroup>(null);

  const [appleValues, setAppleValues] = useState<number[]>(() => {
    return Array.from(
      { length: 200 },
      (_) => 1 + ~~(Math.random() * (goalValue - 1))
    );
  });

  const [score, setScore] = useState(0);

  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPlaying(false);
    }, 120 * 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleSelect = (selected: React.Component<AppleProps>[]) => {
    const total = selected.reduce(
      (total, apple) => total + apple.props.value,
      0
    );

    if (total === goalValue) {
      const ids = selected
        .filter((apple) => apple.props.value > 0)
        .map((apple) => apple.props.id);
      const newValues = appleValues.slice();
      for (const id of ids) {
        newValues[id] = 0;
      }

      setAppleValues(newValues);
      setScore(score + ids.length);
    }
  };

  useLayoutEffect(() => {
    const selectBox = document
      .getElementsByClassName("selectable-selectbox")
      .item(0);
    selectBox?.classList.add("selectable-selectbox-partial");
  }, []);

  const handleDuring = (selected: React.Component<AppleProps>[]) => {
    const total = selected.reduce(
      (total, apple) => total + apple.props.value,
      0
    );

    const selectBox = document
      .getElementsByClassName("selectable-selectbox")
      .item(0);
    if (total === 10) {
      selectBox?.classList.add("selectable-selectbox-valid");
      selectBox?.classList.remove("selectable-selectbox-partial");
    } else {
      selectBox?.classList.add("selectable-selectbox-partial");
      selectBox?.classList.remove("selectable-selectbox-valid");
    }
  };

  return (
    <GenericBoard
      appleValues={appleValues}
      handleDuring={handleDuring}
      handleSelect={handleSelect}
      playing={playing}
      score={score}
      selectionRef={selectionRef}
    />
  );
};

export default QuickPlayPage;
