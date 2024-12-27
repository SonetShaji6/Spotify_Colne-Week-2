
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './Context';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/Home';


function App() {
  const { token } = useContext(AuthContext);


  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/signin" />;
  };

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
  );
}



export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);


