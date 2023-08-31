import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON requests
app.use(express.json());

// In-memory data storage
const users = [];
const tokens = [];

// Register endpoint
app.post("/profile/register", async (req, res) => {
  const { username, password, email } = req.body;

  // Check if user already exists
  const existingUser = users.find(
    (user) => user.username === username || user.email === email
  );
  if (existingUser) {
    return res
      .status(400)
      .json({ status: "error", message: "Username or email already exists." });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  res.json({
    status: "success",
    message: "User registered successfully.",
    data: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

// Login endpoint
app.post("/profile/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid username or password." });
  }

  const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" });
  tokens.push(token);

  res.json({
    status: "success",
    message: "Login successful.",
    token,
  });
});

// Logout endpoint
app.post("/profile/logout", (req, res) => {
  const { token } = req.body;

  const index = tokens.indexOf(token);
  if (index === -1) {
    return res.status(400).json({ status: "error", message: "Invalid token." });
  }

  tokens.splice(index, 1);
  res.json({
    status: "success",
    message: "Logged out successfully.",
  });
});

// Sample route to test the server
app.get("/", (req, res) => {
  res.send("Hello, Workintech Student! Mini Twitter X API Server is running");
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Mini Twitter X API Server is running on http://localhost:${PORT}`
  );
});
