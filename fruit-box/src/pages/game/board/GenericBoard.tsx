import React, { useEffect, useMemo } from "react";
import { SelectableGroup } from "react-selectable-fast";
import Apple from "../Apple";
import ProgressBar from "../progress/ProgressBar";
import song from "../../../res/song.mp3";
import useSound from "use-sound";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

interface Props {
  score: number;
  playing: boolean;
  handleDuring: (e: any) => void;
  handleSelect: (e: any) => void;
  selectionRef: any;
  appleValues?: number[];
  rows?: number;
  cols?: number;
  duration: number;
  average?: number;
  appleRenderer?: JSX.Element;
}

const GenericBoard: React.FC<Props> = ({
  appleValues,
  handleDuring,
  playing,
  score,
  selectionRef,
  handleSelect,
  children,
  duration,
  cols = 20,
  rows = 10,
  average,
  appleRenderer,
}) => {
  const [play, { stop }] = useSound(song, {
    volume: 0.15,
    interrupt: true,
  });

  useEffect(() => {
    play();
    return () => {
      stop();
    };
  }, [play, stop]);

  const horizontal = useMediaQuery("(orientation: landscape)", true, false);

  const style = useMemo(() => {
    if (horizontal) {
      return {
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      };
    }
    return {
      gridTemplateColumns: `repeat(${rows}, 1fr)`,
      gridTemplateRows: `repeat(${cols}, 1fr)`,
    };
  }, [horizontal, rows, cols]);

  return (
    <>
      <section className="lg:my-24 my-0 max-w-7xl mx-auto flex flex-col md:flex-row gap-x-4">
        <div className="flex flex-row justify-center">
          <div className="p-4 bg-green-400 dark:bg-green-600 rounded">
            <div className="text-center text-4xl font-semibold pb-4 text-white text-shadow">
              {score}
            </div>
            <SelectableGroup
              disabled={!playing}
              ref={selectionRef}
              resetOnStart
              onSelectionFinish={handleSelect}
              tolerance={20}
              duringSelection={handleDuring}
            >
              <div
                style={style}
                className="grid p-4 bg-gray-300 dark:bg-dark-400 rounded"
              >
                {appleRenderer ? (
                  <>{appleRenderer}</>
                ) : (
                  <>
                    {appleValues?.map((value, key) => (
                      <Apple key={key} value={value} id={key} />
                    ))}
                  </>
                )}
              </div>
            </SelectableGroup>
            {average && (
              <div className="text-center text-xl font-semibold pt-2 text-white text-shadow">
                Average apple value: {average.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        <div className="md:w-12 w-full mt-2 md:mt-0">
          <ProgressBar duration={duration - 2} />
        </div>
      </section>
      {children}
    </>
  );
};

export default GenericBoard;
