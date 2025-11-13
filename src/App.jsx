import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from './Pages/userPage'; 
import LoginPage from './Pages/login';
import SignupPage from './Pages/signup';


const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const PrivateRoute = ({ element: Element, ...rest }) => {
  return isAuthenticated() ? <Element {...rest} /> : <Navigate to="/login" replace />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/users" element={<PrivateRoute element={UsersPage} />} />
        <Route path="/" element={isAuthenticated() ? <Navigate to="/users" replace /> : <Navigate to="/login" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;