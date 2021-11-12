import React from "react";
import { SelectableGroup } from "react-selectable-fast";
import Apple, { AppleProps } from "../game/Apple";
import { ReactComponent as AppleImg } from "../../res/apple.svg";
import { NegativeApple } from "../game/quickplay/modifier/NegativeApple";
import SelectableQuickplayApple from "../game/quickplay/QuickplayApple";
import { useHistory } from "react-router";

const HelpPage: React.FC = () => {
  const selectionRef = React.useRef<SelectableGroup>(null);

  const [valid, setValid] = React.useState(false);

  const history = useHistory();

  const handleDuring = (selected: React.Component<AppleProps>[]) => {
    const sum = selected.reduce((acc, cur) => acc + cur.props.value, 0);

    const selectBox = document
      .getElementsByClassName("selectable-selectbox")
      .item(0);
    if (sum === 10) {
      setValid(true);
      selectBox?.classList.add("selectable-selectbox-valid");
      selectBox?.classList.remove("selectable-selectbox-partial");
    } else {
      setValid(false);
      selectBox?.classList.add("selectable-selectbox-partial");
      selectBox?.classList.remove("selectable-selectbox-valid");
    }
  };

  return (
    <div className="flex flex-col justify-center mt-24 items-center gap-y-8 dark:text-gray-100 mx-4 mb-24">
      <h1 className="text-6xl font-bold">Tutorial</h1>
      <div className="text-lg font-semibold text-center flex flex-col gap-y-4">
        <p>Welcome to the Apple Game!</p>
        <p>The goal is simple. Just match apples to make groups of 10!</p>
        <p>Try drag to select the 10 below.</p>
      </div>
      <SelectableGroup
        resetOnStart
        ref={selectionRef}
        duringSelection={handleDuring}
        tolerance={20}
      >
        <div className="w-72 flex flex-row bg-green-500 rounded-lg p-2">
          <Apple value={4} id={0} />
          <Apple value={1} id={0} />
          <Apple value={3} id={0} />
          <Apple value={2} id={0} />
        </div>
      </SelectableGroup>
      <div className="text-lg font-semibold -mt-4">
        {!valid ? (
          <div className="text-red-500">Not yet...</div>
        ) : (
          <div className="text-green-500">Nice!</div>
        )}
      </div>
      <div className="text-lg font-semibold text-center flex flex-col gap-y-4 shadow rounded dark:bg-dark-600 p-4 max-w-prose">
        <p>In the real game, there will be a big board with many apples.</p>
        <p>
          Try to collect as many apples as you can in the two minutes you have.
          Each apple gives you one point!
        </p>
      </div>
      <h1 className="text-4xl font-bold mt-4">Apple Variants</h1>
      <div className="text-lg font-semibold text-center mb-4">
        <p>
          When playing non-classic single player, there are several apple
          variants.
        </p>
      </div>
      <div className="flex flex-col text-left gap-y-4 font-medium text-lg">
        <VisualApple
          text="4"
          colors="text-red-700 dark:text-red-900"
          description="A persistent apple. This one will need to be selected in two groups before going away (but you will get points for it each time!)"
        />
        <VisualApple
          text="-8"
          colors="text-green-500 dark:text-green-700"
          description="A negative apple. This one will subtract from your count to 10."
        />
        <VisualApple
          text="6"
          colors="text-yellow-500 dark:text-yellow-600"
          description="A multiplier apple. This apple will double the points of the entire match!"
        />
        <VisualApple
          text="??"
          colors="text-pink-500 dark:text-pink-700"
          description="A wildcard apple. This one can become any number between 0 and 10 - whatever you need to make a match to 10!"
        />
      </div>
      <button
        onClick={() => history.push("/")}
        className="transition-all duration-300 md:w-32 text-xl text-white bg-green-500 p-3 font-semibold rounded-xl hover:bg-green-600 active:hover:bg-green-700 disabled:bg-gray-500"
      >
        {"Let's Go!"}
      </button>
    </div>
  );
};

const VisualApple: React.FC<{
  text: string;
  colors: string;
  description: string;
}> = ({ colors, text, description }) => (
  <div className="flex flex-row gap-x-8 items-center">
    <div className="w-20 min-w-[5rem] flex justify-center items-center">
      <AppleImg className={`w-full h-full fill-current ${colors}`} />
      <div className="absolute text-white font-bold text-xl sm:text-3xl select-none sm:mt-1 mt-[2px]">
        {text}
      </div>
    </div>
    <div className="max-w-prose">{description}</div>
  </div>
);
export default HelpPage;
