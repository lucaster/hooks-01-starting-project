import React, { useState } from 'react';

export const AuthContext = React.createContext({
  authenticated: false,
  login: () => {},
});

const AuthContextProvider = (props) => {

  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        login: handleLogin,
        authenticated: authenticated,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
