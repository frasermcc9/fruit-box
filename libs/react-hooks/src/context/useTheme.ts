import { LOCAL_STORAGE, THEME } from '@apple-game/constants';
import { getPreferredColorScheme } from '../hooks/usePreferredColorScheme';
import { createStatefulContext } from './useStatefulContext';

const [useTheme, ThemeContextProvider] = createStatefulContext<{
  theme: THEME;
}>(
  {
    theme:
      (localStorage.getItem(LOCAL_STORAGE.THEME) as THEME) ||
      getPreferredColorScheme(),
  },
  (state) => {
    localStorage.setItem(LOCAL_STORAGE.THEME, state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }
);

export { useTheme, ThemeContextProvider };
