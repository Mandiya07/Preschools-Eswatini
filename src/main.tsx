import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

const HelmetProviderComponent = HelmetProvider as any;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProviderComponent>
      <App />
    </HelmetProviderComponent>
  </StrictMode>,
);
