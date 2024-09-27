const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS to allow requests from different origins (e.g., frontend on different port)
app.use(cors());

// Path to the users JSON file
const usersFilePath = path.join(__dirname, 'users.json');

// Function to read users from JSON file
const readUsersFromFile = () => {
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
};

// Function to write users to JSON file
const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// CRUD Routes

// GET: Fetch all users
app.get('/api/users', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});

// POST: Add a new user
app.post('/api/users', (req, res) => {
    const users = readUsersFromFile();
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
    };
    users.push(newUser);
    writeUsersToFile(users);
    res.status(201).json(newUser);
});

// PUT: Update a user
app.put('/api/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
        users[userIndex].name = req.body.name;
        writeUsersToFile(users);
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// DELETE: Delete a user
app.delete('/api/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userId = parseInt(req.params.id);
    const newUsersList = users.filter((user) => user.id !== userId);

    if (users.length !== newUsersList.length) {
        writeUsersToFile(newUsersList);
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
