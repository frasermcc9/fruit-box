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
import { createScoreIncrease } from "../../components/animation/scoreIncrease/ScoreIncreaseHandler";
import {
  QuickplayContextProvider,
  useQuickplay,
} from "../../../hooks/useQuickplay";
import { FrozenGenerator } from "./gen/FrozenGenerator";
import { usePollingEffect } from "../../../hooks/usePollingEffect";
import { useIO } from "../../../hooks/useIO";

interface Props {
  goalValue?: number;
  appleCount?: number;
}

const QuickPlayPage: React.FC = () => {
  return (
    <QuickplayContextProvider>
      <QuickPlayInternal />
    </QuickplayContextProvider>
  );
};

const QuickPlayInternal: React.FC<Props> = ({
  goalValue = 10,
  appleCount = 170,
}) => {
  const { search } = useLocation();

  const io = useIO();

  const [mode, detail] = useMemo(() => {
    const params = new URLSearchParams(search);
    let value = params.get("classic");
    if (value) {
      return ["classic", null];
    }
    value = params.get("replay");
    if (value) {
      return ["replay", value];
    }
    return ["blitz", null];
  }, [search]);

  const selectionRef = React.useRef<SelectableGroup>(null);

  const [{ board, endTime, startTime }, setQuickplay] = useQuickplay();

  const appleValues = board;

  const setAppleValues = useCallback(
    (values: Entity[]) => setQuickplay((p) => ({ ...p, board: values })),
    [setQuickplay]
  );

  const calcApples = useCallback(() => {
    if (mode === "replay") {
      const replay = sessionStorage.getItem(detail ?? "");
      if (replay) {
        const parsed = JSON.parse(replay);
        return new BoardCreator({ replay: parsed }).getBoard();
      }
    }

    const creator = new BoardCreator({ appleCount, target: goalValue });

    if (mode === "blitz") {
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
        )
        .applyModifier(
          new FrozenGenerator({ appleCount: 1, context: setQuickplay })
        );
      return creator.getBoard();
    } else {
      return creator.getBoard();
    }
  }, [mode, appleCount, goalValue, detail, setQuickplay]);

  useEffect(() => {
    if (mode !== "classic") {
      const apples = calcApples();
      setAppleValues(apples);

      const now = Date.now();
      setQuickplay((p) => ({
        ...p,
        startTime: now,
        endTime: now + 2 * 60000,
      }));
    } else {
      io?.emit("requestQuickplay");

      io?.once("quickplayResponse", ({ values }: { values: number[] }) => {
        const board = new BoardCreator({ replay: values }).getBoard();
        setQuickplay((p) => ({
          ...p,
          board,
          startTime: Date.now(),
          endTime: Date.now() + 2 * 60000,
        }));
      });

      io?.once("quickplayOver", ({ score }) => {
        setScore(score);
      });
    }
  }, [calcApples, io, mode, setAppleValues, setQuickplay]);

  const [score, setScore] = useState(0);

  const [playing, setPlaying] = useState(true);

  const average = useMemo(() => {
    const sum = appleValues.reduce((a, b) => a + b.getBaseValue(), 0);
    return sum / appleValues.length;
  }, [appleValues]);

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

  const handleSelect = useCallback(
    (selected: React.Component<QuickplayAppleProps>[]) => {
      const visibleApples = getVisibleApples(selected);
      const total = getSum(visibleApples);

      const selectedApples = visibleApples.map((apple) => apple.props.apple);
      const appleIds = visibleApples.map((apple) => apple.props.id);
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

        io?.emit("move", appleIds);

        setAppleValues(newValues);
        setScore((old) => old + scoreToAdd);
        playPop();
        createScoreIncrease("board-score", scoreToAdd);
      }
    },
    [
      appleValues,
      getSum,
      getVisibleApples,
      goalValue,
      io,
      playPop,
      setAppleValues,
    ]
  );

  useLayoutEffect(() => {
    const selectBox = document
      .getElementsByClassName("selectable-selectbox")
      .item(0);
    selectBox?.classList.add("selectable-selectbox-partial");
  }, []);

  const handleDuring = useCallback(
    (selected: React.Component<QuickplayAppleProps>[]) => {
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
    },
    [getSum, getVisibleApples, goalValue]
  );

  const resetGame = () => {
    window.location.reload();
  };

  const [percent, setPercent] = useState(0);
  usePollingEffect(
    () => {
      const calculateTimePercent = () => {
        const [start, now, end] = [startTime, Date.now(), endTime];
        return ((now - start) / (end - start)) * 100;
      };
      const percent = calculateTimePercent();
      if (percent > 100) {
        setPlaying(false);
      }
      setPercent(percent);
    },
    1000,
    [startTime, endTime, playing]
  );

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
        average={average}
        percentage={100 - percent}
        appleRenderer={
          <>
            {appleValues.map((entity, key) => {
              return (
                <SelectableQuickplayApple apple={entity} key={key} id={key} />
              );
            })}
          </>
        }
      />
      {playing || <QuickPlayOver score={score} reset={resetGame} mode={mode} />}
    </>
  );
};

export default QuickPlayPage;
