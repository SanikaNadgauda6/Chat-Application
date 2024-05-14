import React, { useContext, useState } from "react";
import "./signup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../context";
import { toast } from 'react-toastify';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);


    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/auth/login/", { email, password });
            if (response.data.status) {
                setIsLoggedIn(true);
                toast.success("Login Successful");
                navigate('/chats');
            }
        } catch (err) {
            console.log("error is ", err);
        }
    }

    return (
        <>
            <h1>Chat Application</h1>
            
            <div className="sign-up-container">
                <form action="" className="sign-up-form" onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    
                    <label htmlFor="Email">Email:</label>
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>

                    <label htmlFor="password">Password:</label>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    
                    <button type="submit" className="signup-button">Login</button>
                    
                    <p>Don't Have an account? <Link to="/"> Signup</Link></p>
                </form>
        </div>
        
        </>
  )
};

export default Login;
