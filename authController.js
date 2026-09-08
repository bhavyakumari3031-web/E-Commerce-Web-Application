const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { isValidEmail, required } = require("../utils/validation");

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!required(name) || !required(email) || !required(password)) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must contain at least 6 characters." });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
    if (existing.length) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [name.trim(), email.toLowerCase(), hash]
    );

    const user = { id: result.insertId, name: name.trim(), email: email.toLowerCase(), role: "user" };
    res.status(201).json({ message: "Registration successful.", token: signToken(user), user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!required(email) || !required(password)) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (!rows.length) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({ message: "Login successful.", token: signToken(safeUser), user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed." });
  }
}

module.exports = { register, login };
