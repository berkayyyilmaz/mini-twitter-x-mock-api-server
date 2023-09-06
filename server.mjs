import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

// Import the tweets data in required format

// import tweets.json from data/tweets.json and init server with that seed data
import tweetsData from "./data/tweets.json" assert { type: "json" };

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON requests
app.use(express.json());

// In-memory data storage
const users = [];

const tokens = [];
function initializePredefinedUsers() {
  const predefinedUsers = [
    {
      id: nanoid(5),
      username: "Ephraim21",
      password: "l_dxA27E49g6pIy",
      email: "Cristal_DAmore@yahoo.com",
    },
    {
      id: nanoid(5),
      username: "Lloyd27",
      password: "IESEqL_B87wrgR5",
      email: "Colin20@gmail.com",
    },
    {
      id: nanoid(5),
      username: "Tatum_Schneider",
      password: "oaZSxaOPcQfzhF6",
      email: "Marielle76@gmail.com",
    },
  ];

  predefinedUsers.forEach(async (user) => {
    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", {
      expiresIn: "12h",
      // Generate and store the token
    });
    tokens.push(token);

    // Store the user with hashed password
    const updatedUser = {
      ...user,
      hashedPassword,
      token,
    };
    users.push(updatedUser);
    console.log("Predefined user:", updatedUser);
  });
  console.log("Predefined users initialized successfully.");
}

// Initialize predefined users
initializePredefinedUsers();
console.log("Predefined users:", users);

// ----------------------
// Sample Route
// ----------------------

// Sample route to test the server
app.get("/", (req, res) => {
  res.send("Hello, Workintech Student! Mini Twitter X API Server is running");
});

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
    id: nanoid(5),
    username,
    email,
    password,
    hashedPassword,
  };

  users.push(newUser);

  res.json({
    status: "success",
    message: "User registered successfully.",
    data: {
      id: newUser.username,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

// Login endpoint
app.post("/profile/login", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid username or password." });
  }

  const token = jwt.sign({ id: user.id }, "SECRET_KEY", {
    expiresIn: "12h",
  });
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
  /* console.log(
    "request Token",
    tokens,
    `${token?.slice(0, 5)}...${token?.slice(token?.length - 5)}, ${token}`
  ); */
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

const tweets = [...tweetsData];

// Get all tweets
app.post("/tweet", authenticateToken, (req, res) => {
  const { content } = req.body;

  const newTweet = {
    id: nanoid(5),
    userId: req.user.username,
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

// get all tweets
app.get("/tweet", (req, res) => {
  res.json({
    status: "success",
    message: "Tweets retrieved successfully.",
    data: tweets,
  });
});

// Get a single tweet
app.get("/tweet/:id", (req, res) => {
  const tweetId = req.params.id;
  console.log(tweetId);
  const tweet = tweets.find((t) => t.id === tweetId.toString());

  if (!tweet) {
    return res
      .status(404)
      .json({ status: "error", message: "Tweet not found." });
  }

  res.json({
    status: "success",
    message: "Tweet retrieved successfully.",
    data: tweet,
  });
});

// Edit a tweet
app.put("/tweet/:id", authenticateToken, (req, res) => {
  const tweetId = req.params.id;
  const { content } = req.body;

  const tweet = tweets.find((t) => t.id === tweetId);

  if (!tweet) {
    return res
      .status(404)
      .json({ status: "error", message: "Tweet not found." });
  }

  tweet.content = content;

  res.json({
    status: "success",
    message: "Tweet updated successfully.",
    data: tweet,
  });
});

// Delete a tweet
app.delete("/tweet/:id", authenticateToken, (req, res) => {
  const tweetId = req.params.id;

  const tweet = tweets.find((t) => t.id === tweetId);

  if (!tweet) {
    return res
      .status(404)
      .json({ status: "error", message: "Tweet not found." });

    // Check if the user is the owner of the tweet
    if (tweet.username !== req.user.username) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to delete this tweet.",
      });
    }
  }

  const index = tweets.indexOf(tweet);
  tweets.splice(index, 1);

  res.json({
    status: "success",
    message: "Tweet deleted successfully.",
  });
});

// Like a tweet
app.post("/tweet/like/:id", authenticateToken, (req, res) => {
  const tweetId = req.params.id;

  const tweet = tweets.find((t) => t.id === tweetId);

  if (!tweet) {
    return res
      .status(404)
      .json({ status: "error", message: "Tweet not found." });
  }

  tweet.likes = tweet.likes + 1;

  res.json({
    status: "success",
    message: "Tweet liked successfully.",
  });
});

// Unlike a tweet
app.delete("/tweet/like/:id", authenticateToken, (req, res) => {
  const tweetId = req.params.id;

  const tweet = tweets.find((t) => t.id === tweetId);

  if (!tweet) {
    return res
      .status(404)
      .json({ status: "error", message: "Tweet not found." });
  }

  tweet.likes = tweet.likes > 0 ? tweet.likes - 1 : 0;

  res.json({
    status: "success",
    message: "Tweet unliked successfully.",
  });
});

// Reply to a tweet
app.post("/tweet/reply/:id", authenticateToken, (req, res) => {
  const tweetId = req.params.id;
  const { content, username } = req.body;

  const tweet = tweets.find((t) => t.id === tweetId);

  if (!tweet) {
    return res
      .status(404)
      .json({ status: "error", message: "Tweet not found." });
  }

  // Create a new tweet for the reply
  const reply = {
    id: `${tweetId}__${nanoid(5)}`,
    content,
    likes: 0,
    retweets: 0,
    username,
  };

  tweet.replies.push(reply);

  tweets.push(reply);

  res.json({
    status: "success",
    message: "Tweet replied successfully.",
  });
});

// Delete a reply
app.delete("/tweet/reply/:replyid", authenticateToken, (req, res) => {
  const replyId = req.params.replyid;
  const tweetId = req.params.replyid.split("__")[0];

  const tweet = tweets.find((t) => t.id === tweetId);

  if (!tweet) {
    return res
      .status(404)
      .json({ status: "error", message: "Tweet not found." });
  }

  const reply = tweet.replies.find((r) => r.id === replyId);

  if (!reply) {
    return res
      .status(404)
      .json({ status: "error", message: "Reply not found." });
  }

  tweet.replies = tweet.replies.filter((r) => r.id !== replyId);

  res.json({
    status: "success",
    message: "Reply deleted successfully.",
  });
});

// Retweet a tweet
app.post("/tweet/retweet/:id", authenticateToken, (req, res) => {
  const tweetId = req.params.id;
  const { username } = req.body;
  console.log(tweetId, username);

  const originalTweet = tweets.find((t) => t.id === tweetId);

  if (!originalTweet) {
    return res
      .status(404)
      .json({ status: "error", message: "Tweet not found." });
  }

  // Check if the user has already retweeted
  const userRetweet = tweets.find(
    (t) => t.retweetedFrom === tweetId && t.username === username
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
    id: nanoid(5),
    content: originalTweet.content, // Copying content from original tweet
    likes: 0,
    retweets: 0,
    replies: [],
    username, // The user who retweeted
    retweetedFrom: originalTweet.id, // Reference to the original tweet
  };

  tweets.push(retweet);

  res.json({
    status: "success",
    message: "Tweet retweeted successfully.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Mini Twitter X API Server is running on http://localhost:${PORT}`
  );
});
