import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { ThemeContextProvider } from '@apple-game/react-hooks';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <ThemeContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeContextProvider>
  </StrictMode>
);
