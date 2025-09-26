const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock user database (replace with actual database)
let users = [
  {
    id: 1,
    email: 'admin@optima.com',
    password: '$2b$10$hash', // bcrypt hash of 'admin123'
    role: 'admin',
    name: 'Sarah Admin',
    isActive: true
  },
  {
    id: 2,
    email: 'manager@optima.com',
    password: '$2b$10$hash',
    role: 'manager',
    name: 'John Manager',
    isActive: true
  },
  {
    id: 3,
    email: 'employee@optima.com',
    password: '$2b$10$hash',
    role: 'employee',
    name: 'Mike Employee',
    isActive: true
  },
  {
    id: 4,
    email: 'vendor@techcorp.com',
    password: '$2b$10$hash',
    role: 'vendor',
    name: 'TechCorp Rep',
    isActive: true,
    vendorId: 'VENDOR001'
  }
];

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      vendorId: user.vendorId || null
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email && u.isActive);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register endpoint (admin only)
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'manager', 'employee', 'vendor']),
  body('name').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password, role, name, vendorId } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      role,
      name,
      isActive: true,
      ...(role === 'vendor' && vendorId && { vendorId })
    };
    
    users.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // In a real implementation, you might invalidate the token
  res.json({ message: 'Logout successful' });
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.id === decoded.id && u.isActive);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;