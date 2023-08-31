import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON requests
app.use(express.json());

// In-memory data storage
const users = [];
const tokens = [
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkzNTA0NTE4LCJleHAiOjE2OTM1MDgxMTh9.IUlyLJAcrqT0lwquK5-mD_tPdmrT7ndibnr6CiRZ5cg",
];

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

  const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "12h" });
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
//----------------------
// Tweet Routes
//----------------------

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(
    "request Token",
    tokens,
    `${token?.slice(0, 5)}...${token?.slice(token?.length - 5)}, ${token}`
  );
  if (!token)
    return res
      .status(401)
      .json({ status: "error", message: "Token not provided." });

  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ status: "error", message: "Invalid token." });
    req.user = user;
    next();
  });
};

// In-memory data storage
const tweets = [];

// Get all tweets
app.post("/tweet", authenticateToken, (req, res) => {
  const { content } = req.body;

  const newTweet = {
    id: tweets.length + 1,
    content,
    likes: 0,
    retweets: 0,
    replies: [],
  };

  tweets.push(newTweet);

  res.json({
    status: "success",
    message: "Tweet posted successfully.",
    data: newTweet,
  });
});

// Retweet a tweet
app.post("/tweet/retweet/:id", authenticateToken, (req, res) => {
  const tweetId = parseInt(req.params.id);
  const { userId } = req.body;

  const originalTweet = tweets.find((t) => t.id === tweetId);

  if (!originalTweet) {
    return res
      .status(404)
      .json({ status: "error", message: "Tweet not found." });
  }

  // Check if the user has already retweeted
  const userRetweet = tweets.find(
    (t) => t.retweetedFrom === tweetId && t.userId === userId
  );
  if (userRetweet) {
    return res.status(400).json({
      id: userRetweet.id,
      status: "error",
      message: "User has already retweeted this tweet.",
    });
  }

  originalTweet.retweets += 1;

  // Create a new tweet for the retweet
  const retweet = {
    id: tweets.length + 1,
    content: originalTweet.content, // Copying content from original tweet
    likes: 0,
    retweets: 0,
    replies: [],
    userId, // The user who retweeted
    retweetedFrom: originalTweet.id, // Reference to the original tweet
  };

  tweets.push(retweet);

  res.json({
    status: "success",
    message: "Tweet retweeted successfully.",
  });
});

// ----------------------
// Sample Route
// ----------------------

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
