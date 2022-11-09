import { Heading } from '../../common';
import { useTabs } from '../../common/hook-components/useTabs';
import { CheckedMessage } from './CheckedMessage';

export const QuickplayBox = () => {
  const [GameTypeTabs, { item: gameType }] = useTabs({
    choices: [{ name: 'Classic' }, { name: 'Blitz' }, { name: 'Timeless' }],
  });
  const [
    RankedModeTabs,
    {
      item: { name: rankedType },
    },
  ] = useTabs({
    choices: [
      { name: 'Ranked', disabled: false },
      { name: 'Freeplay' },
      { name: 'Casual' },
    ],
  });

  return (
    <div className="mx-4 flex flex-col items-center rounded bg-white p-4 shadow dark:bg-zinc-800 md:w-[30rem]">
      <Heading.H2>Single Player</Heading.H2>
      <div className="my-4" />
      {GameTypeTabs}
      {RankedModeTabs}
      <button className="w-full rounded-lg bg-rose-500 py-2 text-xl font-bold text-white transition-colors hover:bg-rose-500/80">
        Play
      </button>

      <div className="ml-1 mt-3 flex flex-col gap-y-2 self-start">
        <CheckedMessage
          checked={rankedType !== 'Ranked'}
          checkedMessage="Can be played without logging in."
          uncheckedMessage="You must be logged in to play."
        />
        <CheckedMessage
          checked={rankedType !== 'Casual'}
          checkedMessage={`You can post to the ${gameType.name} Leaderboard.`}
          uncheckedMessage="You cannot post to any Leaderboard."
        />
        <CheckedMessage
          checked={rankedType === 'Ranked'}
          checkedMessage="This game will impact your Rank Score."
          uncheckedMessage="This game will not impact your Rank Score."
        />
      </div>
    </div>
  );
};
