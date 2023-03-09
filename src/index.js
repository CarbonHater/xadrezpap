// index.js

import React from 'react';
import createRoot from 'react-dom/client';
import App from './App';


createRoot(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
