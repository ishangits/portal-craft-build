const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock users database
let users = [
  {
    id: 1,
    email: 'admin@optima.com',
    role: 'admin',
    name: 'Sarah Admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: 2,
    email: 'manager@optima.com',
    role: 'manager',
    name: 'John Manager',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: 3,
    email: 'employee@optima.com',
    role: 'employee',
    name: 'Mike Employee',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: 4,
    email: 'vendor@techcorp.com',
    role: 'vendor',
    name: 'TechCorp Rep',
    isActive: true,
    vendorId: 'VENDOR001',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

// Get all users (admin only)
router.get('/', (req, res) => {
  try {
    const { role, isActive } = req.query;
    let filteredUsers = [...users];

    // Filter by role
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Filter by active status
    if (isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === (isActive === 'true'));
    }

    // Remove passwords from response
    const safeUsers = filteredUsers.map(({ password, ...user }) => user);

    res.json({ users: safeUsers });

  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = users.find(user => user.id === parseInt(id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password, ...safeUser } = user;
    res.json({ user: safeUser });

  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['admin', 'manager', 'employee', 'vendor']),
  body('isActive').optional().isBoolean(),
  body('vendorId').optional().trim()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, email, role, isActive, vendorId } = req.body;
    
    // Check if email is already taken by another user
    if (email && users.find(u => u.email === email && u.id !== parseInt(id))) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
      ...(vendorId && { vendorId }),
      updatedAt: new Date().toISOString()
    };

    // Remove password from response
    const { password, ...safeUser } = users[userIndex];

    res.json({
      message: 'User updated successfully',
      user: safeUser
    });

  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (soft delete - set inactive)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Soft delete - set inactive
    users[userIndex] = {
      ...users[userIndex],
      isActive: false,
      deletedAt: new Date().toISOString()
    };

    res.json({ message: 'User deactivated successfully' });

  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

// Get users by role
router.get('/role/:role', (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['admin', 'manager', 'employee', 'vendor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const roleUsers = users.filter(user => user.role === role && user.isActive);
    
    // Remove passwords from response
    const safeUsers = roleUsers.map(({ password, ...user }) => user);

    res.json({ users: safeUsers });

  } catch (error) {
    console.error('Role users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users by role' });
  }
});

// Get user statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      byRole: {
        admin: users.filter(u => u.role === 'admin' && u.isActive).length,
        manager: users.filter(u => u.role === 'manager' && u.isActive).length,
        employee: users.filter(u => u.role === 'employee' && u.isActive).length,
        vendor: users.filter(u => u.role === 'vendor' && u.isActive).length
      },
      recentLogins: users.filter(u => {
        const lastLogin = new Date(u.lastLogin);
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return lastLogin > dayAgo;
      }).length
    };

    res.json({ stats });

  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

module.exports = router;