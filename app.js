require("dotenv").config();
require("./config/database").connect();

const User = require("./model/user");

const express = require("express");
const { updateSwitch } = require("typescript");

const app = express();

app.use(express.json());

// Register
app.post("/register", async (req, res) => {
  try {
    // Get user inputs
    const { first_name, last_name, email, password } = req.body;

    // Validate user inputs
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All fields are required!");
    }

    // Check if user already exist
    // Validate if user already exist in the database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User already exist. Please login");
    }

    // Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // Create user token
    const token = jwt.sign({ user_id: user.id, email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    // Save user token
    user.token = token;

    // Return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

// Login
app.post("/login", async (req, res) => {
  // Login goes here
  try {
    const { email, password } = req.body;

    if (!(email, password)) {
      res.status(400).send("All inputs required");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user.id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      user.token = token;

      res.status(200).json(user);
    }
    res.status(400).send("Incorrect Credentials!");
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
