import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]); // To store the list of users
  const [userName, setUserName] = useState(""); // For adding/updating a user's name
  const [editingId, setEditingId] = useState(null); // To store the ID of the user being edited

  // Function to fetch users (GET request)
  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:3000/api/users");
    setUsers(response.data);
  };

  // Function to add a new user (POST request)
  const addUser = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:3000/api/users/${editingId}`, {
        name: userName,
      });
      setEditingId(null);
    } else {
      await axios.post("http://localhost:3000/api/users", { name: userName });
    }
    setUserName("");
    fetchUsers();
  };

  // Function to delete a user (DELETE request)
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:3000/api/users/${id}`);
    fetchUsers();
  };

  // Function to update a user's name (fills the input with the current user info for editing)
  const startEditing = (user) => {
    setUserName(user.name);
    setEditingId(user.id);
  };

  // Function to cancel editing mode
  const cancelEditing = () => {
    setUserName("");
    setEditingId(null);
  };

  // Fetch the users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>User CRUD Application</h1>

      {/* Form for adding/updating users */}
      <form onSubmit={addUser}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter user name"
          required
        />
        <div>
          <button type="submit">
            {editingId ? "Update User" : "Add User"}
          </button>
          {editingId && <button onClick={cancelEditing}>Cancel Edit</button>}
        </div>
      </form>

      {/* Display the list of users */}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div className="user-info">
              {user.name} (ID: {user.id})
            </div>
            <div className="button-group">
              <button onClick={() => startEditing(user)}>Edit</button>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
