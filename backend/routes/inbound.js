const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock inbound data
let inboundRecords = [
  {
    id: 1,
    awb: 'AWB123456789',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    sku: 'SKU001',
    product: 'Wireless Headphones',
    quantity: 50,
    receivedQuantity: 50,
    status: 'completed',
    scannedBy: 'Mike Employee',
    receivedDate: new Date().toISOString(),
    notes: 'All items in good condition'
  },
  {
    id: 2,
    awb: 'AWB987654321',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    sku: 'SKU002',
    product: 'Phone Case',
    quantity: 30,
    receivedQuantity: 28,
    status: 'partial',
    scannedBy: 'John Scanner',
    receivedDate: new Date().toISOString(),
    notes: '2 items damaged during transport'
  },
  {
    id: 3,
    awb: 'AWB456789123',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    sku: 'SKU003',
    product: 'Charging Cable',
    quantity: 100,
    receivedQuantity: null,
    status: 'pending',
    scannedBy: null,
    receivedDate: null,
    notes: 'Awaiting delivery'
  }
];

// Get all inbound records
router.get('/', (req, res) => {
  try {
    const { status, vendorId, date } = req.query;
    let filteredRecords = [...inboundRecords];

    // Filter by status
    if (status) {
      filteredRecords = filteredRecords.filter(record => record.status === status);
    }

    // Filter by vendor
    if (vendorId) {
      filteredRecords = filteredRecords.filter(record => record.vendorId === vendorId);
    }

    // Filter by date (basic date filtering)
    if (date) {
      filteredRecords = filteredRecords.filter(record => 
        record.receivedDate && record.receivedDate.startsWith(date)
      );
    }

    res.json({ inboundRecords: filteredRecords });

  } catch (error) {
    console.error('Inbound records fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch inbound records' });
  }
});

// Get inbound record by AWB
router.get('/awb/:awb', (req, res) => {
  try {
    const { awb } = req.params;
    const record = inboundRecords.find(record => record.awb === awb);

    if (!record) {
      return res.status(404).json({ error: 'Inbound record not found' });
    }

    res.json({ record });

  } catch (error) {
    console.error('Inbound record fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch inbound record' });
  }
});

// Create new inbound record
router.post('/', [
  body('awb').trim().isLength({ min: 1 }),
  body('vendorId').trim().isLength({ min: 1 }),
  body('vendorName').trim().isLength({ min: 1 }),
  body('sku').trim().isLength({ min: 1 }),
  body('product').trim().isLength({ min: 1 }),
  body('quantity').isNumeric().isInt({ min: 1 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { awb, vendorId, vendorName, sku, product, quantity, notes } = req.body;
    
    // Check if AWB already exists
    if (inboundRecords.find(record => record.awb === awb)) {
      return res.status(409).json({ error: 'AWB already exists' });
    }

    const newRecord = {
      id: inboundRecords.length + 1,
      awb,
      vendorId,
      vendorName,
      sku,
      product,
      quantity,
      receivedQuantity: null,
      status: 'pending',
      scannedBy: null,
      receivedDate: null,
      notes: notes || ''
    };

    inboundRecords.push(newRecord);

    res.status(201).json({
      message: 'Inbound record created successfully',
      record: newRecord
    });

  } catch (error) {
    console.error('Inbound record creation error:', error);
    res.status(500).json({ error: 'Failed to create inbound record' });
  }
});

// Process inbound scan (employee action)
router.post('/scan', [
  body('awb').trim().isLength({ min: 1 }),
  body('scannedBy').trim().isLength({ min: 1 }),
  body('receivedQuantity').isNumeric().isInt({ min: 0 }),
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

    const { awb, scannedBy, receivedQuantity, notes } = req.body;
    
    const recordIndex = inboundRecords.findIndex(record => record.awb === awb);
    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Inbound record not found' });
    }

    const record = inboundRecords[recordIndex];
    
    // Update record
    const status = receivedQuantity === record.quantity ? 'completed' : 
                   receivedQuantity === 0 ? 'rejected' : 'partial';

    inboundRecords[recordIndex] = {
      ...record,
      receivedQuantity,
      status,
      scannedBy,
      receivedDate: new Date().toISOString(),
      notes: notes || record.notes
    };

    // In a real app, this would also update inventory stock levels
    console.log(`Inbound processed: ${awb} - ${receivedQuantity}/${record.quantity} received`);

    res.json({
      message: 'Inbound scan processed successfully',
      record: inboundRecords[recordIndex]
    });

  } catch (error) {
    console.error('Inbound scan error:', error);
    res.status(500).json({ error: 'Failed to process inbound scan' });
  }
});

// Get pending inbound items
router.get('/pending', (req, res) => {
  try {
    const pendingRecords = inboundRecords.filter(record => record.status === 'pending');

    res.json({ 
      pendingRecords,
      count: pendingRecords.length
    });

  } catch (error) {
    console.error('Pending inbound fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch pending inbound records' });
  }
});

// Get inbound statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: inboundRecords.length,
      completed: inboundRecords.filter(r => r.status === 'completed').length,
      pending: inboundRecords.filter(r => r.status === 'pending').length,
      partial: inboundRecords.filter(r => r.status === 'partial').length,
      rejected: inboundRecords.filter(r => r.status === 'rejected').length,
      todayReceived: inboundRecords.filter(r => 
        r.receivedDate && r.receivedDate.startsWith(new Date().toISOString().split('T')[0])
      ).length
    };

    res.json({ stats });

  } catch (error) {
    console.error('Inbound stats error:', error);
    res.status(500).json({ error: 'Failed to fetch inbound statistics' });
  }
});

module.exports = router;