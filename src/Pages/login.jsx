import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./userPagecss.css";

const Login = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3000/api/login",
                { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            alert("Login Successful");
            navigate("/users");
        } catch (err) {
            alert("Login Failed:" + (err.response?.data?.message || err.message));
        }
    };
    return (
        <div className="container">
            <h2>Login</h2>
            <form id="loginForm" onSubmit={handleLogin} >

                <label htmlFor="email">Email</label>
                <input type="text" value={email} onChange={(e) => setemail(e.target.value)} placeholder="Enter your Email" />
                <label htmlFor="password">Password</label>
                <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} placeholder="Enter your Password" />
                <button type="submit">Login</button>
            </form>

            <p>Don't have a account ? Please <Link to="/signup">Signup</Link></p>
        </div>
    );
};

export default Login;
