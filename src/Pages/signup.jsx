import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./userPagecss.css";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [Confirmpassword, setConfirmpassword] = useState("");
    const navigate = useNavigate();
    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== Confirmpassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const res = await axios.post("http://localhost:3000/api/signup",
                { username, email, password, Confirmpassword });
            alert(res.data.message || "Signed Up Successfully");
            navigate("/login");
        } catch (err) {
            alert("Signup Failed:" + (err.response?.data?.message || err.message));
        }
    };
    return (
        <div className="container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup} >
                <label htmlFor="Username">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" />
                <label htmlFor="email">Email</label>
                <input type="text" value={email} onChange={(e) => setemail(e.target.value)} placeholder="Enter your Email" />
                <label htmlFor="password">Password</label>
                <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} placeholder="Enter your Password" />
                <label htmlFor="Confirmpassword">ConfirmPassword</label>
                <input type="password" value={Confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} placeholder="Reenter your Password" />
                <button type="submit">Signup</button>
            </form>

            <p>Already have a account ? Please <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Signup;
