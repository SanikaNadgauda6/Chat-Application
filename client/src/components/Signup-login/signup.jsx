import React, { useState } from "react";
import "./signup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';



const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/auth/signup/", {
            username, email, password
        }).then(response => {
            if (response.data.status) {
                toast.success("Sign up Successful. Please Login to continue!");
                navigate('/login');
            }
        }).catch(err => {
            console.log("error is ",err);
        });
    }

    return (
        <>
            <h1>Chat Application</h1>
            <div className="sign-up-container">
                <form action="" className="sign-up-form" onSubmit={handleSubmit}>
                    <h2>Sign up</h2>
                    <label htmlFor="username">Username:</label>
                    <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>

                    <label htmlFor="Email">Email:</label>
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>

                    <label htmlFor="password">Password:</label>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    
                    <button type="submit" className="signup-button">Sign Up</button>

                    <p>Already Have an account? <Link to="/login"> Login </Link></p>
                </form>
        </div>
        
        </>
  )
};

export default Signup;
