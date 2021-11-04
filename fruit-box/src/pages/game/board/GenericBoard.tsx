import React, { useEffect } from "react";
import { SelectableGroup } from "react-selectable-fast";
import Apple from "../Apple";
import ProgressBar from "../progress/ProgressBar";
import song from "../../../res/song.mp3";
import useSound from "use-sound";

interface Props {
  score: number;
  playing: boolean;
  handleDuring: (e: any) => void;
  handleSelect: (e: any) => void;
  selectionRef: any;
  appleValues: number[];
  rows?: number;
  cols?: number;
  duration: number;
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

  return (
    <>
      <section className="lg:my-24 my-0 max-w-7xl mx-auto flex flex-row gap-x-4">
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
                style={{
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                }}
                className="grid p-4 bg-gray-300 dark:bg-dark-400 rounded"
              >
                {appleValues.map((value, key) => (
                  <Apple key={key} value={value} id={key} />
                ))}
              </div>
            </SelectableGroup>
          </div>
        </div>
        <div className="flex-grow w-12">
          <ProgressBar duration={duration} />
        </div>
      </section>
      {children}
    </>
  );
};

export default GenericBoard;
