import React, { useEffect, useLayoutEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { SelectableGroup } from "react-selectable-fast";
import { useIO } from "../../hooks/useIO";
import arrayEquals from "../../utils/ArrayEquality";
import { AppleProps } from "./Apple";
import GenericBoard from "./board/GenericBoard";
import LeaderBoard from "./Leaderboard";
import pop from "../../res/sfx/pop.mp3";
import useSound from "use-sound";
import GameOverModal from "./GameOverModal";
import useLobby from "../../hooks/useLobby";

interface Props {
  goalValue?: number;
}

const GamePage: React.FC<Props> = ({ goalValue = 10 }) => {
  const io = useIO();
  const { name, settings, setLobbyContext } = useLobby();

  const history = useHistory();

  const { gameId } = useParams<{ gameId: string }>();

  const selectionRef = React.useRef<SelectableGroup>(null);

  const [appleValues, setAppleValues] = useState<number[]>([]);

  const [score, setScore] = useState(0);

  const [scores, setScores] = useState<Record<string, number>>({});
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!gameId) return;

    io?.emit("gameRequest", { code: gameId, name }).once(
      "gameResponse",
      (res: number[]) => {
        setAppleValues(res);
      }
    );

    io?.once("gameReset", (args) => {
      setLobbyContext((old) => ({ ...old, code: args.code }));
      history.push("/");
    });

    return () => {
      io?.removeAllListeners("gameReset");
      io?.removeAllListeners("gameResponse");
    };
  }, [io, gameId, name, history, setLobbyContext]);

  const [playPop] = useSound(pop, {
    volume: 0.25,
  });

  useEffect(() => {
    io?.on(
      "moveResult",
      (values: number[], newScores: Record<string, number>) => {
        const synced = arrayEquals(values, appleValues);
        if (!synced) {
          setAppleValues(values);
        }
        setScores(newScores);
        if (newScores[name] !== score) {
          setScore(newScores[name]);
        }
      }
    );

    return () => {
      io?.removeAllListeners("moveResult");
    };
  }, [appleValues, io, name, score]);

  useEffect(() => {
    io?.once("gameResult", (result) => {
      setPlaying(false);
      setScores(result);
    });
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

  const playAgainDispatch = () => {
    io?.emit("playAgain");
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
        duration={settings.gameDuration}
      >
        <LeaderBoard scores={scores} />
      </GenericBoard>
      {playing || (
        <GameOverModal scores={scores} playAgain={playAgainDispatch} />
      )}
    </>
  );
};

export default GamePage;
