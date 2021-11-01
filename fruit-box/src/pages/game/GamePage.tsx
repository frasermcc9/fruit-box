import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router";
import { SelectableGroup } from "react-selectable-fast";
import { IOConsumer, IOContext, IOProvider } from "../../hooks/useIO";
import arrayEquals from "../../utils/ArrayEquality";
import Apple, { AppleProps } from "./Apple";
import GenericBoard from "./board/GenericBoard";
import LeaderBoard from "./Leaderboard";
import ProgressBar from "./progress/ProgressBar";

interface Props {
  goalValue?: number;
  playerId: string;
}

const GamePage: React.FC<Props> = ({ goalValue = 10, playerId }) => {
  const io = useContext(IOContext);
  const { gameId } = useParams<{ gameId: string }>();

  const selectionRef = React.useRef<SelectableGroup>(null);

  const [appleValues, setAppleValues] = useState<number[]>([]);

  const [score, setScore] = useState(0);

  const [scores, setScores] = useState<Record<string, number>>({});
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!gameId) return;

    io?.emit("gameRequest", { code: gameId, name: playerId }).once(
      "gameResponse",
      (res: number[]) => {
        setAppleValues(res);
      }
    );

    const timeout = setTimeout(() => {
      setPlaying(false);
    }, 120 * 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [io, gameId, playerId]);

  useEffect(() => {
    io?.on(
      "moveResult",
      (values: number[], newScores: Record<string, number>) => {
        const synced = arrayEquals(values, appleValues);
        if (!synced) {
          setAppleValues(values);
        }
        setScores(newScores);
        if (newScores[playerId] !== score) {
          setScore(newScores[playerId]);
        }
      }
    );

    return () => {
      io?.removeAllListeners("moveResult");
    };
  }, [appleValues, io, playerId, score]);

  useEffect(() => {
    if (!playing) {
      io?.emit("timeOver").once("gameResult", (result) => {
        console.log(result);
      });
    }
  }, [playing, io]);

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

      io?.emit("move", ids);
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
    >
      <LeaderBoard scores={scores} />
    </GenericBoard>
  );
};

export default GamePage;
