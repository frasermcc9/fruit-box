import { PropsWithChildren } from 'react';

const Header = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-zinc-50 p-4 transition-colors dark:bg-zinc-900 sm:sticky">
      {children}
    </div>
  );
};

const Page = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <div className="">{children}</div>
    </main>
  );
};

const Margin = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <div className={'w-full px-4'}>{children}</div>
    </div>
  );
};

const Content = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <div className={'mx-auto flex w-full flex-col items-center'}>
        {children}
      </div>
    </div>
  );
};

export const Layout = {
  Header,
  Page,
  Content,
  Margin,
};
