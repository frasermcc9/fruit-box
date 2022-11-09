import {
  BoardRenderer,
  ClassicProvider,
  Layout,
  Navbar,
} from '@apple-game/react-components';

export const ClassicPage = () => {
  return (
    <Layout.Page>
      <Layout.Header>
        <Navbar />
      </Layout.Header>
      <Layout.Content>
        <ClassicProvider>
          {(args) => <BoardRenderer {...args} />}
        </ClassicProvider>
      </Layout.Content>
    </Layout.Page>
  );
};
