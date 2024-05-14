import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
        return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/check-auth', { withCredentials: true });
                if (response.data.status) {
                    setUser(response.data.user);
                    setIsLoggedIn(true);
                    // toast.success("Login Successful");
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setUser(null);
                setIsLoggedIn(false);
            }
        };

        checkAuth();
    }, []); // Empty dependency array to run only once

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]); // Run when isLoggedIn changes

    return (
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, user }}>
            {children}
        </LoginContext.Provider>
    );
};
