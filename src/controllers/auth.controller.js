import User from '../models/User.js';
import { signUserToken, setAuthCookie, clearAuthCookie } from '../utils/jwt.js';

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl || '',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function register(req, res) {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password) return res.status(400).json({ message: 'Missing required fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ email, name, role, passwordHash });

    const token = signUserToken({ id: user._id.toString(), role: user.role });
    setAuthCookie(res, token);

    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signUserToken({ id: user._id.toString(), role: user.role });
    setAuthCookie(res, token);

    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function updateMe(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, avatarUrl } = req.body;
    if (name !== undefined) user.name = name;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export function logout(_req, res) {
  clearAuthCookie(res);
  return res.json({ message: 'Logged out' });
}

// Admin functions
export async function getAllUsers(req, res) {
  try {
    const users = await User.find({}).select('-passwordHash');
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role, avatarUrl } = req.body;
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.avatarUrl = avatarUrl !== undefined ? avatarUrl : user.avatarUrl;
    
    await user.save();
    
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await User.findByIdAndDelete(id);
    
    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
