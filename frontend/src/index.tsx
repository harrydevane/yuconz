import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import auth from './utils/auth';

(async () => {
  await auth.tryRefresh();
  ReactDOM.render(<App />, document.getElementById('root'));
})();
