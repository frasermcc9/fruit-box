import { THEME } from '@apple-game/constants';
import { useEffect, useMemo, useState } from 'react';

export const getPreferredColorScheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return THEME.DARK;
  }
  return THEME.LIGHT;
};

export const usePreferredColorScheme = () => {
  return useMemo(() => getPreferredColorScheme(), []);
};

export const useWatchPreferredColorScheme = () => {
  const [theme, setTheme] = useState(getPreferredColorScheme());

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setTheme(THEME.DARK);
      } else {
        setTheme(THEME.LIGHT);
      }
    };

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', listener);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', listener);
    };
  }, []);

  return theme;
};
