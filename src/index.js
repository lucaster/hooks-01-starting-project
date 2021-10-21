import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthContextProvider from './context/auth-context';
import './index.css';

ReactDOM.render(
  <AuthContextProvider>
    {/* App will see the AuthContext by using useContext() */}
    <App />
  </AuthContextProvider>,
  document.getElementById('root')
);
