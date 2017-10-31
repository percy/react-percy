import App from './App';
import React from 'react';

percySnapshot('This is a snapshot of the app', { widths: [320, 768, 1280] }, () => {
  return <App />;
});
