import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { SelectableGroup } from "react-selectable-fast";
import useSound from "use-sound";
import GenericBoard from "../board/GenericBoard";
import QuickPlayOver from "./QuickPlayOver";
import pop from "../../../res/sfx/pop.mp3";
import { Entity } from "./modifier";
import { BoardCreator } from "./gen";
import { MultiplierGenerator } from "./gen/MultiplierGenerator";
import { PersistentGenerator } from "./gen/PersistentGeneration";
import { WildcardGenerator } from "./gen/WildcardGenerator";
import { useLocation } from "react-router";
import SelectableQuickplayApple, {
  QuickplayAppleProps,
} from "./QuickplayApple";
import { NegativeGenerator } from "./gen/NegativeGenerator";

interface Props {
  goalValue?: number;
  appleCount?: number;
}

const QuickPlayPage: React.FC<Props> = ({
  goalValue = 10,
  appleCount = 170,
}) => {
  const { search } = useLocation();

  const classic = useMemo(() => {
    const params = new URLSearchParams(search);
    const value = params.get("classic");
    return JSON.parse(value as string) as boolean;
  }, [search]);

  const selectionRef = React.useRef<SelectableGroup>(null);

  const calcApples = useCallback(() => {
    const creator = new BoardCreator({ appleCount, target: goalValue });
    if (!classic) {
      creator
        .applyModifier(
          new MultiplierGenerator({ multiplier: 2, appleCount: 5 })
        )
        .applyModifier(new PersistentGenerator({ appleCount: 5 }))
        .applyModifier(
          new WildcardGenerator({
            appleCount: 5,
          })
        )
        .applyModifier(
          new NegativeGenerator({ target: goalValue, appleCount: 5 })
        );
    }
    return creator.getBoard();
  }, [appleCount, classic, goalValue]);
  const [appleValues, setAppleValues] = useState<Entity[]>(calcApples);

  const [score, setScore] = useState(0);

  const [playing, setPlaying] = useState(true);

  const average = useMemo(() => {
    const sum = appleValues.reduce((a, b) => a + b.getBaseValue(), 0);
    return sum / appleValues.length;
  }, [classic]);

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

  const getVisibleApples = useCallback(
    (selected: React.Component<QuickplayAppleProps>[]) => {
      return selected.filter((a) => a.props.apple.isVisible());
    },
    []
  );

  /**
   * Includes invisible apples
   */
  const getSum = useCallback(
    (selected: React.Component<QuickplayAppleProps>[]) => {
      return selected.reduce((a, b) => a + b.props.apple.getBaseValue(), 0);
    },
    []
  );

  const handleSelect = (selected: React.Component<QuickplayAppleProps>[]) => {
    const visibleApples = getVisibleApples(selected);
    const total = getSum(visibleApples);

    const selectedApples = visibleApples.map((apple) => apple.props.apple);
    const newValues = appleValues.slice();

    if (
      total === goalValue ||
      selectedApples.some((a) => a.preTargetHook(total))
    ) {
      let scoreToAdd = 0;

      const processQueue: ((s: number) => number)[] = [];
      for (const apple of selectedApples) {
        scoreToAdd += apple.onSelection(newValues, processQueue);
      }

      let bonusScore: number[] = [];
      for (const process of processQueue) {
        bonusScore.push(process(scoreToAdd));
      }
      scoreToAdd += bonusScore.reduce((a, b) => a + b, 0);

      setAppleValues(newValues);
      setScore((old) => old + scoreToAdd);
      playPop();
    }
  };

  useLayoutEffect(() => {
    const selectBox = document
      .getElementsByClassName("selectable-selectbox")
      .item(0);
    selectBox?.classList.add("selectable-selectbox-partial");
  }, []);

  const handleDuring = (selected: React.Component<QuickplayAppleProps>[]) => {
    const visibleApples = getVisibleApples(selected);
    const total = getSum(visibleApples);

    const selectedApples = visibleApples.map((apple) => apple.props.apple);

    const selectBox = document
      .getElementsByClassName("selectable-selectbox")
      .item(0);
    if (
      total === goalValue ||
      selectedApples.some((a) => a.preTargetHook(total))
    ) {
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
        handleDuring={handleDuring}
        handleSelect={handleSelect}
        playing={playing}
        score={score}
        selectionRef={selectionRef}
        cols={17}
        rows={10}
        duration={120}
        average={average}
        appleRenderer={
          <>
            {appleValues.map((entity, key) => {
              return <SelectableQuickplayApple apple={entity} key={key} />;
            })}
          </>
        }
      />
      {playing || (
        <QuickPlayOver
          score={score}
          reset={resetGame}
          mode={classic ? "classic" : "blitz"}
        />
      )}
    </>
  );
};

export default QuickPlayPage;
