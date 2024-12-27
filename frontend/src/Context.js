
import { createContext, useState, useEffect } from "react";

// AuthContext for handling authentication state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// MusicContext for handling music-related state
export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultOffset, setResultOffset] = useState(0);

  return (
    <MusicContext.Provider
      value={{
        isLoading,
        setIsLoading,
        resultOffset,
        setResultOffset,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

// Combined ContextProvider to wrap the whole app
export const CombinedProvider = ({ children }) => {
  return (
    <AuthProvider>
      <MusicProvider>
        {children}
      </MusicProvider>
    </AuthProvider>
  );
};


