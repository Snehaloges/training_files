import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;
const SECRET_KEY = "secretkey123";

app.use(cors())
app.use(express.json())


mongoose.connect("mongodb://127.0.0.1:27017/newsdashboard")
    .then(() => console.log("mongodb connected successfully"))
    .catch(err => console.error("Mongodb error:", err));


const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

function authToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = decodedUser;
        next();
    });
}
app.post("/api/signup", async (req, res) => {
    const { username, email, password, Confirmpassword } = req.body;
    if (!username || !email || !password || !Confirmpassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== Confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match" })
    }
    const exist = await User.findOne({ email });
    if (exist)
        return res.status(400).json("User already Exist");
    const hashed = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();
    res.json({ message: "User Registered successfully" })
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({
        message: "User Not found"
    });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({
        message: "Invalid Credentials"
    });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: "1h" })
    res.json({ message: "Login Successful", username: user.username, token });

});

//const NEWS_API  = "0ff15c6ff00141d4851ad5a96cdfc7ba";

// app.get("/api/news", async (req, res)=>{
//     const query = req.query.q || "technology";
//     const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API}`;
//     try{
//         const response = await fetch(url);
//         const data = await response.json();
//         res.json(data.articles.slice(0,20));
//     }
//     catch(err){
//         console.error("Error Fetching news:", err);
//         err.status(500).json({
//             error:"Failed to Fetch news"
//         });

//     }
//});
app.get("/api/users", authToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to Fetch users"
        });
    }
});
app.put("/api/users/:id", authToken, async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
        const existUser = await User.findById(id);
        if (!existUser) return res.status(404).json({ error: "User not found" });
        let updatedPassword = existUser.password;
        if (password && password.trim() !== "") {
            updatedPassword = await bcrypt.hash(password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, password: updatedPassword },
            { new: true }
        );
        res.json(updatedUser);
    }
    catch (err) {
        res.status(500).json({
            error: "Update Failed"
        });
    }
});

app.delete("/api/users/:id", authToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({ error: "User not found" });

        }
        res.json({ message: "User deleted Successfully" });
    }
    catch (err) {
        res.status(500).json({
            error: " Failed to delete User"
        });
    }
});

app.delete("/api/users", authToken, async (req, res) => {

    try {
        const deleteUser = await User.deleteMany({});
        if (!deleteUser) {
            return res.status(404).json({ error: "User not found" });

        }
        res.json({ message: "All users deleted Successfully" });
    }
    catch (err) {
        res.status(500).json({
            error: " Failed to delete User"
        });
    }
});

app.listen(PORT, () => console.log("Server running on http://localhost:3000"))