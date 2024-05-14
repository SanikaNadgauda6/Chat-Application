import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Auth from "./auth/auth";
import Signup from './components/Signup-login/signup';
import Register from "./auth/register";
import { ChatPage } from './components/chatsPage';
import { LoginContext } from './context';
import Login from './components/Signup-login/login';

const App = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/chats" /> : <Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chats" element={isLoggedIn ? <ChatPage /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
