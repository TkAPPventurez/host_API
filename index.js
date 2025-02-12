const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());

// Load existing users from JSON file
const usersFilePath = path.join(__dirname, "task.json");
let users = require(usersFilePath);

// GET /users - Return an HTML list of users
app.get("/users", (req, res) => {
    const html = `
    <h1>Users List</h1>
    <ul>
        ${users.map(user => `<li> - Lat: ${user.latitude}, Lng: ${user.longitude}</li>`).join("")}
    </ul>`;

    res.send(html);
});

app.post("/location", (req, res) => {
    const { latitude, longitude, timestamp } = req.body;

    if ( !latitude || !longitude || !timestamp) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser = { latitude, longitude, timestamp };
    users.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to save data" });
        }
        res.json({ message: "Location saved successfully", data: newUser });
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
