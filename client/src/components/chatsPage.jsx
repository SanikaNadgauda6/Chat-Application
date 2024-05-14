// chatPage.jsx
import React, { useContext, useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import './chatPage.css';
import { LoginContext } from '../context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export const ChatPage = () => {
    const navigate = useNavigate();
    const socketRef = useRef();
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useContext(LoginContext);
    const userName = user ? user.username : '';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() !== "") { // Check if message is not empty
            socketRef.current.emit("message", { message, username: userName });
            setMessage("");
        }
    }

    const handleLogout = () => {
        axios.get('http://localhost:3000/auth/logout')
            .then(res => {
                if (res.data.status) {
                    toast.success("Logout Successful");
                    navigate('/login');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        axios.get('http://localhost:3000/auth/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    useEffect(() => {
        if (user) {
            socketRef.current = io("http://localhost:3000");
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [user]);

    useEffect(() => {
        if (user) {
            // Establish socket connection
            socketRef.current = io("http://localhost:3000");

            // Event listener for incoming messages
            socketRef.current.on("receive-message", (data) => {
                setAllMessages(prevMessages => [...prevMessages, data]);
            });

            // Event listener for initial message load
            socketRef.current.on("load_messages", (messages) => {
                setAllMessages(messages);
            });

            // Disconnect socket when component unmounts
            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        }
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='header'>
                <h3>Welcome {userName}</h3>
                <button className='signout-button' onClick={handleLogout}>Logout</button>
            </div>
            <div className='ChatPage'>
                <div className="UserList">
                    <h2>Users Available </h2>
                    <ul className='userlists'>
                        {users.map(user => (
                            <li key={user._id}>{user.username}</li>
                        ))}
                    </ul>
                </div>
                
                <div className="chatPanel">
                    <div className='Messages'>
                        {allMessages.map((m, i) => (
                            <div key={i} className={m.username === userName ? "sent-message" : "received-message"}>
                                <span style={{ fontWeight: 'bold' }}>{m.username}:</span>
                                <p>{m.message}</p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className='form'>
                        <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter Your Message' />
                        <button type='submit' className='send-button'>Send</button>
                    </form>
                </div>
            </div>
        </>
    );
};
