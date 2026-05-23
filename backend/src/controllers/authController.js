const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const allowedRoles = ["community_member", "facility_manager", "worker", "admin"];

const cleanUser = (user) => {
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

const register = async (req, res) => {
  try {
    const { full_name, name, email, password, role } = req.body;
    const finalName = full_name || name;
    const finalRole = role || "community_member";

    if (!finalName || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }

    if (!allowedRoles.includes(finalRole)) {
      return res.status(400).json({ error: "Invalid role selected." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name: finalName,
          email: email.toLowerCase(),
          password_hash: hashedPassword,
          role: finalRole,
          is_active: true,
        },
      ])
      .select("id, full_name, email, role, is_active, created_at")
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .limit(1);

    if (error || !users || users.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    if (user.is_active === false) {
      return res.status(403).json({ error: "This account is deactivated." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: cleanUser(user),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  return res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  register,
  login,
  logout,
};
