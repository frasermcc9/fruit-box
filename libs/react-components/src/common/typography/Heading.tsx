import { PropsWithChildren } from 'react';

const H1 = ({ children }: PropsWithChildren) => {
  return <h1 className="text-3xl font-bold">{children}</h1>;
};

const H2 = ({ children }: PropsWithChildren) => {
  return <h2 className="text-2xl font-bold">{children}</h2>;
};

export const Heading = { H1, H2 };
