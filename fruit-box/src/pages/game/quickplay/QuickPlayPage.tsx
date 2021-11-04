import React, { useEffect, useLayoutEffect, useState } from "react";
import { SelectableGroup } from "react-selectable-fast";
import useSound from "use-sound";
import { AppleProps } from "../Apple";
import GenericBoard from "../board/GenericBoard";
import QuickPlayOver from "./QuickPlayOver";
import pop from "../../../res/sfx/pop.mp3";

interface Props {
  goalValue?: number;
  appleCount?: number;
}

const QuickPlayPage: React.FC<Props> = ({
  goalValue = 10,
  appleCount = 170,
}) => {
  const selectionRef = React.useRef<SelectableGroup>(null);

  const calcApples = () =>
    Array.from(
      { length: appleCount },
      (_) => 1 + ~~(Math.random() * (goalValue - 1))
    );

  const [appleValues, setAppleValues] = useState<number[]>(calcApples);

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

  const [playPop] = useSound(pop, {
    volume: 0.25,
  });

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
      playPop();
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

  const resetGame = () => {
    // setAppleValues(calcApples());
    // setScore(0);
    // setPlaying(true);
    window.location.reload();
  };

  return (
    <>
      <GenericBoard
        appleValues={appleValues}
        handleDuring={handleDuring}
        handleSelect={handleSelect}
        playing={playing}
        score={score}
        selectionRef={selectionRef}
        cols={17}
        rows={10}
        duration={120}
      />
      {playing || <QuickPlayOver score={score} reset={resetGame} />}
    </>
  );
};

export default QuickPlayPage;
