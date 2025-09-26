const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock returns data
let returnsRecords = [
  {
    id: 1,
    returnId: 'RET001',
    originalAwb: 'OUT123456789',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    sku: 'SKU001',
    product: 'Wireless Headphones',
    quantity: 1,
    reason: 'Damaged in transit',
    condition: 'damaged',
    status: 'processing',
    receivedBy: 'Mike Returns',
    receivedDate: new Date().toISOString(),
    restockedQuantity: 0,
    notes: 'Package was crushed during shipping'
  },
  {
    id: 2,
    returnId: 'RET002',
    originalAwb: 'OUT987654321',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    sku: 'SKU002',
    product: 'Phone Case',
    quantity: 2,
    reason: 'Wrong item shipped',
    condition: 'good',
    status: 'resolved',
    receivedBy: 'Lisa Quality',
    receivedDate: new Date().toISOString(),
    restockedQuantity: 2,
    notes: 'Items in perfect condition, ready for resale'
  },
  {
    id: 3,
    returnId: 'RET003',
    originalAwb: 'OUT456789123',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    sku: 'SKU003',
    product: 'Charging Cable',
    quantity: 1,
    reason: 'Customer return',
    condition: 'good',
    status: 'resolved',
    receivedBy: 'John Inspector',
    receivedDate: new Date().toISOString(),
    restockedQuantity: 1,
    notes: 'Customer changed mind, item unused'
  }
];

// Get all returns records
router.get('/', (req, res) => {
  try {
    const { status, vendorId, condition, date } = req.query;
    let filteredRecords = [...returnsRecords];

    // Filter by status
    if (status) {
      filteredRecords = filteredRecords.filter(record => record.status === status);
    }

    // Filter by vendor
    if (vendorId) {
      filteredRecords = filteredRecords.filter(record => record.vendorId === vendorId);
    }

    // Filter by condition
    if (condition) {
      filteredRecords = filteredRecords.filter(record => record.condition === condition);
    }

    // Filter by date
    if (date) {
      filteredRecords = filteredRecords.filter(record => 
        record.receivedDate && record.receivedDate.startsWith(date)
      );
    }

    res.json({ returnsRecords: filteredRecords });

  } catch (error) {
    console.error('Returns records fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch returns records' });
  }
});

// Get return record by ID
router.get('/:returnId', (req, res) => {
  try {
    const { returnId } = req.params;
    const record = returnsRecords.find(record => record.returnId === returnId);

    if (!record) {
      return res.status(404).json({ error: 'Return record not found' });
    }

    res.json({ record });

  } catch (error) {
    console.error('Return record fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch return record' });
  }
});

// Create new return record
router.post('/', [
  body('returnId').trim().isLength({ min: 1 }),
  body('originalAwb').trim().isLength({ min: 1 }),
  body('vendorId').trim().isLength({ min: 1 }),
  body('vendorName').trim().isLength({ min: 1 }),
  body('sku').trim().isLength({ min: 1 }),
  body('product').trim().isLength({ min: 1 }),
  body('quantity').isNumeric().isInt({ min: 1 }),
  body('reason').trim().isLength({ min: 1 }),
  body('condition').isIn(['good', 'damaged', 'defective', 'expired'])
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { 
      returnId, originalAwb, vendorId, vendorName, 
      sku, product, quantity, reason, condition, notes 
    } = req.body;
    
    // Check if return ID already exists
    if (returnsRecords.find(record => record.returnId === returnId)) {
      return res.status(409).json({ error: 'Return ID already exists' });
    }

    const newRecord = {
      id: returnsRecords.length + 1,
      returnId,
      originalAwb,
      vendorId,
      vendorName,
      sku,
      product,
      quantity,
      reason,
      condition,
      status: 'pending',
      receivedBy: null,
      receivedDate: null,
      restockedQuantity: 0,
      notes: notes || ''
    };

    returnsRecords.push(newRecord);

    res.status(201).json({
      message: 'Return record created successfully',
      record: newRecord
    });

  } catch (error) {
    console.error('Return record creation error:', error);
    res.status(500).json({ error: 'Failed to create return record' });
  }
});

// Process return scan (employee action)
router.post('/scan', [
  body('returnId').trim().isLength({ min: 1 }),
  body('receivedBy').trim().isLength({ min: 1 }),
  body('condition').isIn(['good', 'damaged', 'defective', 'expired']),
  body('restockedQuantity').isNumeric().isInt({ min: 0 }),
  body('notes').optional().trim()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { returnId, receivedBy, condition, restockedQuantity, notes } = req.body;
    
    const recordIndex = returnsRecords.findIndex(record => record.returnId === returnId);
    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Return record not found' });
    }

    const record = returnsRecords[recordIndex];
    
    // Update record
    const status = restockedQuantity === record.quantity ? 'resolved' : 
                   restockedQuantity === 0 ? 'rejected' : 'partial';

    returnsRecords[recordIndex] = {
      ...record,
      condition,
      restockedQuantity,
      status: status === 'rejected' ? 'damaged' : status,
      receivedBy,
      receivedDate: new Date().toISOString(),
      notes: notes || record.notes
    };

    // In a real app, this would also update inventory stock levels if restocked
    console.log(`Return processed: ${returnId} - ${restockedQuantity}/${record.quantity} restocked`);

    res.json({
      message: 'Return scan processed successfully',
      record: returnsRecords[recordIndex]
    });

  } catch (error) {
    console.error('Return scan error:', error);
    res.status(500).json({ error: 'Failed to process return scan' });
  }
});

// Get pending returns
router.get('/pending', (req, res) => {
  try {
    const pendingReturns = returnsRecords.filter(record => 
      record.status === 'pending' || record.status === 'processing'
    );

    res.json({ 
      pendingReturns,
      count: pendingReturns.length
    });

  } catch (error) {
    console.error('Pending returns fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch pending returns' });
  }
});

// Get damaged/rejected items
router.get('/damaged', (req, res) => {
  try {
    const damagedReturns = returnsRecords.filter(record => 
      record.condition === 'damaged' || record.condition === 'defective' || record.status === 'damaged'
    );

    res.json({ 
      damagedReturns,
      count: damagedReturns.length
    });

  } catch (error) {
    console.error('Damaged returns fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch damaged returns' });
  }
});

// Get returns statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: returnsRecords.length,
      pending: returnsRecords.filter(r => r.status === 'pending').length,
      processing: returnsRecords.filter(r => r.status === 'processing').length,
      resolved: returnsRecords.filter(r => r.status === 'resolved').length,
      damaged: returnsRecords.filter(r => r.status === 'damaged' || r.condition === 'damaged').length,
      todayReceived: returnsRecords.filter(r => 
        r.receivedDate && r.receivedDate.startsWith(new Date().toISOString().split('T')[0])
      ).length,
      restockRate: Math.round((returnsRecords.filter(r => r.restockedQuantity > 0).length / returnsRecords.length) * 100)
    };

    res.json({ stats });

  } catch (error) {
    console.error('Returns stats error:', error);
    res.status(500).json({ error: 'Failed to fetch returns statistics' });
  }
});

module.exports = router;