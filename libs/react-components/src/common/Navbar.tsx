import { THEME } from '@apple-game/constants';
import { useTheme } from '@apple-game/react-hooks';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  CodeBracketIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { ReactComponent as AmongUsIcon } from '../res/among-us.svg';

export const Navbar = () => {
  const [{ theme }, setTheme] = useTheme();

  const swapTheme = () => {
    setTheme(({ theme }) => ({
      theme: theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT,
    }));
  };

  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  const goToHelp = () => {
    navigate('/tutorial');
  };

  const goToStats = () => {
    navigate('/stats');
  };

  return (
    <div className="flex gap-x-2">
      <HeaderButton
        action={goHome}
        icon={<AmongUsIcon height={32} width={32} />}
      />
      <HeaderButton
        action={swapTheme}
        icon={
          theme === THEME.LIGHT ? (
            <SunIcon className="w-8 text-current" />
          ) : (
            <MoonIcon className="w-8 text-current" />
          )
        }
      />
      <HeaderButton
        action={goToHelp}
        icon={<QuestionMarkCircleIcon className="w-8 text-current" />}
      />
      <HeaderButton
        action={goToStats}
        icon={<ChartBarIcon className="w-8 text-current" />}
      />
      <HeaderButton
        action={() =>
          window.open('https://github.com/frasermcc9/fruit-box', '_blank')
        }
        icon={<CodeBracketIcon className="w-8 text-current" />}
      />
    </div>
  );
};

const HeaderButton: React.FC<{ action: () => void; icon: JSX.Element }> = ({
  action,
  icon,
}) => {
  return (
    <button
      className="hover:bg-zinc-50 dark:hover:bg-zinc-900 p-2 rounded"
      onClick={action}
    >
      {icon}
    </button>
  );
};
