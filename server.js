// server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const SECRET_KEY = 'your_secret_key'; // Khóa bí mật dùng để mã hóa JWT
const cors = require('cors');

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Data lưu trữ tạm thời trên server
const users = {}; // { username: password }

// API Register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (users[username]) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Lưu thông tin người dùng
  users[username] = password;

  // Tạo JWT token
  const token = jwt.sign({ username }, SECRET_KEY);

  res.json({ token });
});

// API Login
app.post('/api/login', (req, res) => {
  const { token } = req.body;

  try {
    // Giải mã token
    const decoded = jwt.verify(token, SECRET_KEY);
    const { username } = decoded;

    // Kiểm tra username
    if (users[username]) {
      res.json({ message: 'Success' });
    } else {
      res.status(400).json({ message: 'Fail: User does not exist' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Fail: Invalid token' });
  }
});

