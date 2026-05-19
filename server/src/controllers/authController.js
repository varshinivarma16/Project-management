import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { createToken } from "../utils/createToken.js";

const authResponse = (user) => ({
  token: createToken(user._id.toString()),
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email
  }
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  return res.status(201).json(authResponse(user));
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json(authResponse(user));
};
