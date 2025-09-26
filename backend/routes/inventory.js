const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock inventory data
let inventory = [
  {
    id: 1,
    sku: 'SKU001',
    product: 'Wireless Headphones',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    currentStock: 45,
    inboundToday: 12,
    outboundToday: 8,
    reservedStock: 5,
    status: 'normal',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    sku: 'SKU002',
    product: 'Phone Case',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    currentStock: 23,
    inboundToday: 0,
    outboundToday: 15,
    reservedStock: 3,
    status: 'low',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    sku: 'SKU003',
    product: 'Charging Cable',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    currentStock: 67,
    inboundToday: 20,
    outboundToday: 5,
    reservedStock: 8,
    status: 'normal',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    sku: 'SKU004',
    product: 'Screen Protector',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    currentStock: 8,
    inboundToday: 5,
    outboundToday: 12,
    reservedStock: 2,
    status: 'critical',
    lastUpdated: new Date().toISOString()
  }
];

// Get all inventory items
router.get('/', (req, res) => {
  try {
    const { vendorId, status, search } = req.query;
    let filteredInventory = [...inventory];

    // Filter by vendor
    if (vendorId) {
      filteredInventory = filteredInventory.filter(item => item.vendorId === vendorId);
    }

    // Filter by status
    if (status) {
      filteredInventory = filteredInventory.filter(item => item.status === status);
    }

    // Search by SKU or product name
    if (search) {
      const searchLower = search.toLowerCase();
      filteredInventory = filteredInventory.filter(item => 
        item.sku.toLowerCase().includes(searchLower) ||
        item.product.toLowerCase().includes(searchLower)
      );
    }

    res.json({ inventory: filteredInventory });

  } catch (error) {
    console.error('Inventory fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Get inventory item by SKU
router.get('/sku/:sku', (req, res) => {
  try {
    const { sku } = req.params;
    const item = inventory.find(item => item.sku === sku);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ item });

  } catch (error) {
    console.error('Inventory item fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
});

// Update stock levels
router.put('/stock/:sku', [
  body('quantity').isNumeric(),
  body('operation').isIn(['add', 'subtract', 'set']),
  body('reason').trim().isLength({ min: 1 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { sku } = req.params;
    const { quantity, operation, reason } = req.body;
    
    const itemIndex = inventory.findIndex(item => item.sku === sku);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = inventory[itemIndex];
    let newStock = item.currentStock;

    switch (operation) {
      case 'add':
        newStock += quantity;
        break;
      case 'subtract':
        newStock = Math.max(0, newStock - quantity);
        break;
      case 'set':
        newStock = quantity;
        break;
    }

    // Update stock and status
    inventory[itemIndex] = {
      ...item,
      currentStock: newStock,
      status: newStock < 10 ? 'critical' : newStock < 25 ? 'low' : 'normal',
      lastUpdated: new Date().toISOString()
    };

    // Log the transaction (in real app, save to transactions table)
    console.log(`Stock update: ${sku} ${operation} ${quantity} - ${reason}`);

    res.json({ 
      message: 'Stock updated successfully',
      item: inventory[itemIndex]
    });

  } catch (error) {
    console.error('Stock update error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// Create new inventory item
router.post('/', [
  body('sku').trim().isLength({ min: 1 }),
  body('product').trim().isLength({ min: 1 }),
  body('vendorId').trim().isLength({ min: 1 }),
  body('vendorName').trim().isLength({ min: 1 }),
  body('initialStock').isNumeric().isInt({ min: 0 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { sku, product, vendorId, vendorName, initialStock } = req.body;
    
    // Check if SKU already exists
    if (inventory.find(item => item.sku === sku)) {
      return res.status(409).json({ error: 'SKU already exists' });
    }

    const newItem = {
      id: inventory.length + 1,
      sku,
      product,
      vendorId,
      vendorName,
      currentStock: initialStock,
      inboundToday: 0,
      outboundToday: 0,
      reservedStock: 0,
      status: initialStock < 10 ? 'critical' : initialStock < 25 ? 'low' : 'normal',
      lastUpdated: new Date().toISOString()
    };

    inventory.push(newItem);

    res.status(201).json({
      message: 'Inventory item created successfully',
      item: newItem
    });

  } catch (error) {
    console.error('Inventory creation error:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// Get low stock alerts
router.get('/alerts/low-stock', (req, res) => {
  try {
    const lowStockItems = inventory.filter(item => 
      item.status === 'low' || item.status === 'critical'
    );

    res.json({ 
      alerts: lowStockItems,
      count: lowStockItems.length
    });

  } catch (error) {
    console.error('Low stock alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch low stock alerts' });
  }
});

module.exports = router;