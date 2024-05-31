import React from "react";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        userData,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;
