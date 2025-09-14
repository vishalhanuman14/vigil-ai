import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ZoneProvider } from './context/ZoneContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ZoneProvider>
        <App />
      </ZoneProvider>
    </BrowserRouter>
  </React.StrictMode>
);