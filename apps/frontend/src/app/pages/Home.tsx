import {
  Heading,
  Layout,
  Navbar,
  QuickplayBox,
} from '@apple-game/react-components';

export const Home = () => {
  return (
    <Layout.Page>
      <Layout.Header>
        <Navbar />
      </Layout.Header>
      <Layout.Content>
        <Heading.H1>Welcome to Apple Game</Heading.H1>
        <section className="my-4">
          <QuickplayBox />
        </section>
      </Layout.Content>
    </Layout.Page>
  );
};
