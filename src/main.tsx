import './App.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';
import AppProviders from './app/providers';
// Import a safelist to ensure Tailwind generates specific classes even if built dynamically
import './styles/tw-safelist';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);
