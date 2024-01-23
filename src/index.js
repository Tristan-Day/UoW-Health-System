import React from 'react';
import ReactDOM from 'react-dom';

import '@aws-amplify/ui-react/styles.css'
import '@atlaskit/css-reset';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);