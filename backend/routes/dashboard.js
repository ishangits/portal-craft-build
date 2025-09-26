const express = require('express');
const router = express.Router();

// Mock data for dashboard statistics
const mockStats = {
  admin: {
    totalUsers: 24,
    activeVendors: 8,
    employees: 12,
    dailyTransactions: 156
  },
  manager: {
    inboundPackages: 24,
    outboundShipments: 18,
    returnsProcessed: 6,
    pendingTasks: 3
  },
  employee: {
    itemsScanned: 67,
    inboundProcessed: 23,
    packagesReady: 18,
    returnsHandled: 6
  },
  vendor: {
    totalStock: 143,
    lowStockItems: 2,
    pendingReturns: 1,
    dailyShipments: 8
  }
};

// Get dashboard stats by role
router.get('/stats/:role', (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['admin', 'manager', 'employee', 'vendor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const stats = mockStats[role];
    res.json({ stats });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get recent activities (admin/manager)
router.get('/activities', (req, res) => {
  try {
    const activities = [
      {
        id: 1,
        user: 'John Manager',
        action: 'Created employee account',
        time: '2 min ago',
        type: 'user'
      },
      {
        id: 2,
        user: 'Sarah Admin',
        action: 'Updated vendor permissions',
        time: '15 min ago',
        type: 'vendor'
      },
      {
        id: 3,
        user: 'Mike Employee',
        action: 'Processed 45 AWBs',
        time: '1 hour ago',
        type: 'process'
      },
      {
        id: 4,
        user: 'System',
        action: 'Daily backup completed',
        time: '2 hours ago',
        type: 'system'
      }
    ];

    res.json({ activities });

  } catch (error) {
    console.error('Activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get employee activity (manager)
router.get('/employee-activity', (req, res) => {
  try {
    const employeeActivity = [
      {
        id: 1,
        name: 'John Scanner',
        task: 'Inbound Scanning',
        items: 45,
        status: 'active'
      },
      {
        id: 2,
        name: 'Sarah Packer',
        task: 'Packaging',
        items: 23,
        status: 'active'
      },
      {
        id: 3,
        name: 'Mike Returns',
        task: 'Returns Processing',
        items: 12,
        status: 'break'
      },
      {
        id: 4,
        name: 'Lisa Dispatch',
        task: 'Outbound Prep',
        items: 67,
        status: 'active'
      }
    ];

    res.json({ employeeActivity });

  } catch (error) {
    console.error('Employee activity error:', error);
    res.status(500).json({ error: 'Failed to fetch employee activity' });
  }
});

// Get vendor summary (manager)
router.get('/vendor-summary', (req, res) => {
  try {
    const vendorSummary = [
      {
        id: 1,
        name: 'TechCorp Electronics',
        inbound: 15,
        outbound: 12,
        stock: 156
      },
      {
        id: 2,
        name: 'Fashion Forward',
        inbound: 8,
        outbound: 6,
        stock: 89
      },
      {
        id: 3,
        name: 'Home Essentials',
        inbound: 12,
        outbound: 15,
        stock: 234
      },
      {
        id: 4,
        name: 'Sports Gear Pro',
        inbound: 5,
        outbound: 3,
        stock: 67
      }
    ];

    res.json({ vendorSummary });

  } catch (error) {
    console.error('Vendor summary error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor summary' });
  }
});

module.exports = router;