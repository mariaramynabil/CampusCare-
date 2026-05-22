const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name,
          email,
          password_hash: hashedPassword,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error || users.length === 0) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
};