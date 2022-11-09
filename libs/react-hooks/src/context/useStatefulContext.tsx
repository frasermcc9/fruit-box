import React, { PropsWithChildren, useCallback, useEffect } from 'react';

type ChildFreeProps<T> = Omit<T, 'children'>;

export function createStatefulContext<T extends Record<string, unknown>>(
  defaults: ChildFreeProps<T>,
  updateHook?: (nextState: ChildFreeProps<T>) => void
) {
  const Context = React.createContext<
    [
      ChildFreeProps<T>,
      (updater: (old: ChildFreeProps<T>) => Partial<ChildFreeProps<T>>) => void
    ]
  >([defaults, () => ({})]);

  const StatefulContextComponent = ({
    children,
    ...rest
  }: PropsWithChildren<Partial<T>>) => {
    const [state, setState] = React.useState<ChildFreeProps<T>>({
      ...defaults,
      ...rest,
    });

    const setStateWrapper = useCallback(
      (updater: (old: ChildFreeProps<T>) => Partial<ChildFreeProps<T>>) =>
        setState((old) => ({ ...old, ...updater(old) })),
      []
    );

    useEffect(() => {
      updateHook?.(state);
    }, [state]);

    return (
      <Context.Provider value={[state, setStateWrapper]}>
        {children}
      </Context.Provider>
    );
  };

  return [() => React.useContext(Context), StatefulContextComponent] as const;
}
