import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./userPagecss.css";
// import 'bootstrap/dist/css/bootstrap.css';
// import { Container, Row, Col, Card, Button, Form, Navbar, Nav, Modal } from 'react-bootstrap';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [editUser, seteditUser] = useState(null);
    const [username] = useState(localStorage.getItem("username") || null);

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    }

    const navigate = useNavigate();

    // const startLogoutTimer = useCallback(()=>  { setTimeout(() => {

    //                 if (localStorage.getItem("token")) {
    //                     alert("Your session has expired. Redirecting to login page.");
    //                     logout();
    //                 }
    //             }, 28000);
    //         },[logout]);



    const loadUsers = useCallback(async () => {
        try {
            const res = await axios("http://localhost:3000/api/users", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUsers(res.data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert("Session expired or invalid token. Please log in again.");
                logout();
            }
            else {
                alert("Error in loading users:" + err.message);
            }
        }
    }, [logout, setUsers]);
    //useEffect are sideEffects when u want to make connection with outside of react we use  dependency arr and function like fetching api , dom manually change 

    useEffect(() => {
        if (!username || !localStorage.getItem("token")) {
            navigate("/login")
        }
        else {
            loadUsers();
            //startLogoutTimer();
        }
    }, [loadUsers, navigate, username])
    // startLogoutTimer,

    const deleteUser = async (id, userToDelete) => {
        if (userToDelete === username) {
            alert("Unable to delete Current User");
            return;
        }

        if (window.confirm("Are u sure you want to delete this user?")) {
            try {
                const res = await axios.delete(`http://localhost:3000/api/users/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                alert(res.data.message || res.data.error);
                if (res.data)
                    loadUsers();
            } catch (err) {
                alert("Error deleting user:" + err.message);
            }
        }
    };

    const deleteAllUsers = async () => {
        if (window.confirm("Are u sure you want to delete All user?")) {
            try {
                const res = await axios.delete("http://localhost:3000/api/users", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                alert(res.data.message || res.data.error);

                if (res.data.message === "All users deleted Successfully") {
                    logout();
                }
                else {
                    loadUsers();
                }
            } catch (err) {
                alert("Error deleting user:" + err.message);
            }
        };
    }
    const saveUser = async () => {
        try { 
            await axios.put(`http://localhost:3000/api/users/${editUser._id}`, editUser, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            }
            );
            alert("User Updated Successfully");
            seteditUser(null);
            loadUsers();

        } catch (err) {
            alert("Error Updating User:" + err.message);
        }
    }

    return (
        <div className="Container">
            {/* <Row xs={1} md={2} lg={3} className="g-4"></Row> */}
            {/* bg="dark" data-bs-theme="dark" className="px-4 py-3"> */}
            <nav>
                <h2> Welcome,<span>{username}</span></h2>
                <button onClick={logout}>Logout</button>
            </nav>
            <h1>Registered Users</h1>
            <div id="newsContainer" >
                {users.length === 0 ? (
                    <p>No registered users found</p>) : (users.map((user) => (
                        <div key={user._id} className="card" onClick={(e) => {
                            if (!e.target.classList.contains("delete_btn"))
                                seteditUser(user);
                        }}>
                            <h3>UserName: {user.username}</h3>
                            <p>Email :{user.email}</p>
                            <p>Password :*******</p>
                            <div className="actions">
                                <button onClick={(e) => {
                                    e.stopPropagation(e)
                                    deleteUser(user._id, user.username)
                                }}
                                    className="delete_btn">DELETE</button>
                            </div>
                        </div>)))}
            </div>
            <button id="deleteAllBtn" onClick={deleteAllUsers}>Delete All Users</button>
            {editUser && (<div className="modal"> 
                <div className="modal-content">
                    <h1>Edit User</h1>
                    <label>Username</label>
                    <input type="text" value={editUser.username} onChange={(e) => seteditUser({ ...editUser, username: e.target.value })} />
                    <label>Email</label>
                    <input type="text" value={editUser.email} onChange={(e) => seteditUser({ ...editUser, email: e.target.value })} />
                    <label>Password</label>
                    <input type="password" placeholder="Enter your password" value={editUser.password} onChange={(e) => seteditUser({ ...editUser, password: e.target.value })} />

                    <div className="modal-actions">
                        <button onClick={saveUser}>Save</button>
                        <button onClick={() => seteditUser(null)}>Close</button>
                    </div>
                </div>
            </div>)}
        </div>
    );
};
export default UsersPage;


