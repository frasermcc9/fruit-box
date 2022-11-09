import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import { useCallback, useState } from 'react';

interface Options<T extends string> {
  choices: {
    name: T;
    disabled?: boolean;
  }[];
  defaultIndex?: number;
}

export const useTabs = <T extends string>({
  choices,
  defaultIndex,
}: Options<T>) => {
  const [index, setIndex] = useState(defaultIndex ?? 0);

  const handleSelect = useCallback((index: number) => {
    setIndex(index);
  }, []);

  return [
    <TabComponent choices={choices} handleSelect={handleSelect} />,
    { index, item: choices[index] },
  ] as const;
};

interface TabComponentProps<T extends string> extends Options<T> {
  handleSelect: (index: number) => void;
}

const TabComponent = <T extends string>({
  choices,
  handleSelect,
  defaultIndex,
}: TabComponentProps<T>) => (
  <div className="w-full max-w-md">
    <Tab.Group onChange={handleSelect} defaultIndex={defaultIndex}>
      <Tab.List className="mb-4 flex space-x-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
        {choices.map(({ name, disabled }) => (
          <Tab
            key={name}
            disabled={disabled}
            className={({ selected }) =>
              classnames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-opacity-60 transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-25',
                {
                  'bg-white text-rose-500 shadow dark:bg-zinc-700': selected,
                  'text-zinc-400 hover:bg-white/[0.12] hover:text-zinc-600 dark:hover:text-zinc-100':
                    !selected,
                },
              )
            }
          >
            {name}
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  </div>
);
