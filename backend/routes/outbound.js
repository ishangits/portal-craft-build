const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock outbound data
let outboundRecords = [
  {
    id: 1,
    awb: 'OUT123456789',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    sku: 'SKU001',
    product: 'Wireless Headphones',
    quantity: 5,
    courierName: 'BlueDart',
    trackingNumber: 'BD123456789',
    status: 'dispatched',
    packagedBy: 'Sarah Packer',
    packagedDate: new Date().toISOString(),
    dispatchDate: new Date().toISOString(),
    podGenerated: true,
    notes: 'Fragile items - handle with care'
  },
  {
    id: 2,
    awb: 'OUT987654321',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    sku: 'SKU002',
    product: 'Phone Case',
    quantity: 8,
    courierName: 'FedEx',
    trackingNumber: null,
    status: 'packaged',
    packagedBy: 'Lisa Dispatch',
    packagedDate: new Date().toISOString(),
    dispatchDate: null,
    podGenerated: false,
    notes: 'Priority shipment'
  },
  {
    id: 3,
    awb: 'OUT456789123',
    vendorId: 'VENDOR001',
    vendorName: 'TechCorp Electronics',
    sku: 'SKU003',
    product: 'Charging Cable',
    quantity: 12,
    courierName: null,
    trackingNumber: null,
    status: 'pending',
    packagedBy: null,
    packagedDate: null,
    dispatchDate: null,
    podGenerated: false,
    notes: 'Awaiting packaging'
  }
];

// Get all outbound records
router.get('/', (req, res) => {
  try {
    const { status, vendorId, courier, date } = req.query;
    let filteredRecords = [...outboundRecords];

    // Filter by status
    if (status) {
      filteredRecords = filteredRecords.filter(record => record.status === status);
    }

    // Filter by vendor
    if (vendorId) {
      filteredRecords = filteredRecords.filter(record => record.vendorId === vendorId);
    }

    // Filter by courier
    if (courier) {
      filteredRecords = filteredRecords.filter(record => record.courierName === courier);
    }

    // Filter by date
    if (date) {
      filteredRecords = filteredRecords.filter(record => 
        record.packagedDate && record.packagedDate.startsWith(date)
      );
    }

    res.json({ outboundRecords: filteredRecords });

  } catch (error) {
    console.error('Outbound records fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch outbound records' });
  }
});

// Get outbound record by AWB
router.get('/awb/:awb', (req, res) => {
  try {
    const { awb } = req.params;
    const record = outboundRecords.find(record => record.awb === awb);

    if (!record) {
      return res.status(404).json({ error: 'Outbound record not found' });
    }

    res.json({ record });

  } catch (error) {
    console.error('Outbound record fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch outbound record' });
  }
});

// Create new outbound order
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
    if (outboundRecords.find(record => record.awb === awb)) {
      return res.status(409).json({ error: 'AWB already exists' });
    }

    const newRecord = {
      id: outboundRecords.length + 1,
      awb,
      vendorId,
      vendorName,
      sku,
      product,
      quantity,
      courierName: null,
      trackingNumber: null,
      status: 'pending',
      packagedBy: null,
      packagedDate: null,
      dispatchDate: null,
      podGenerated: false,
      notes: notes || ''
    };

    outboundRecords.push(newRecord);

    res.status(201).json({
      message: 'Outbound order created successfully',
      record: newRecord
    });

  } catch (error) {
    console.error('Outbound order creation error:', error);
    res.status(500).json({ error: 'Failed to create outbound order' });
  }
});

// Process packaging (employee action)
router.post('/package', [
  body('awb').trim().isLength({ min: 1 }),
  body('packagedBy').trim().isLength({ min: 1 }),
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

    const { awb, packagedBy, notes } = req.body;
    
    const recordIndex = outboundRecords.findIndex(record => record.awb === awb);
    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Outbound record not found' });
    }

    const record = outboundRecords[recordIndex];
    
    if (record.status !== 'pending') {
      return res.status(400).json({ error: 'Order already processed' });
    }

    // Update record
    outboundRecords[recordIndex] = {
      ...record,
      status: 'packaged',
      packagedBy,
      packagedDate: new Date().toISOString(),
      notes: notes || record.notes
    };

    // In a real app, this would also reduce inventory stock levels
    console.log(`Outbound packaged: ${awb} - ${record.quantity} items by ${packagedBy}`);

    res.json({
      message: 'Package processed successfully',
      record: outboundRecords[recordIndex]
    });

  } catch (error) {
    console.error('Package processing error:', error);
    res.status(500).json({ error: 'Failed to process package' });
  }
});

// Assign courier and dispatch
router.post('/dispatch', [
  body('awb').trim().isLength({ min: 1 }),
  body('courierName').trim().isLength({ min: 1 }),
  body('trackingNumber').optional().trim()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { awb, courierName, trackingNumber } = req.body;
    
    const recordIndex = outboundRecords.findIndex(record => record.awb === awb);
    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Outbound record not found' });
    }

    const record = outboundRecords[recordIndex];
    
    if (record.status !== 'packaged') {
      return res.status(400).json({ error: 'Package not ready for dispatch' });
    }

    // Update record
    outboundRecords[recordIndex] = {
      ...record,
      courierName,
      trackingNumber: trackingNumber || `TRK${Date.now()}`,
      status: 'dispatched',
      dispatchDate: new Date().toISOString(),
      podGenerated: true
    };

    console.log(`Outbound dispatched: ${awb} via ${courierName}`);

    res.json({
      message: 'Package dispatched successfully',
      record: outboundRecords[recordIndex]
    });

  } catch (error) {
    console.error('Dispatch error:', error);
    res.status(500).json({ error: 'Failed to dispatch package' });
  }
});

// Group packages by courier
router.get('/courier-groups', (req, res) => {
  try {
    const courierGroups = outboundRecords
      .filter(record => record.status === 'packaged' || record.status === 'dispatched')
      .reduce((groups, record) => {
        const courier = record.courierName || 'Unassigned';
        if (!groups[courier]) {
          groups[courier] = [];
        }
        groups[courier].push(record);
        return groups;
      }, {});

    res.json({ courierGroups });

  } catch (error) {
    console.error('Courier groups error:', error);
    res.status(500).json({ error: 'Failed to fetch courier groups' });
  }
});

// Generate POD (Proof of Dispatch)
router.get('/pod/:awb', (req, res) => {
  try {
    const { awb } = req.params;
    const record = outboundRecords.find(record => record.awb === awb);

    if (!record) {
      return res.status(404).json({ error: 'Outbound record not found' });
    }

    if (record.status !== 'dispatched') {
      return res.status(400).json({ error: 'Package not dispatched yet' });
    }

    const pod = {
      awb: record.awb,
      trackingNumber: record.trackingNumber,
      vendor: record.vendorName,
      courier: record.courierName,
      items: [
        {
          sku: record.sku,
          product: record.product,
          quantity: record.quantity
        }
      ],
      dispatchDate: record.dispatchDate,
      generatedAt: new Date().toISOString()
    };

    res.json({ pod });

  } catch (error) {
    console.error('POD generation error:', error);
    res.status(500).json({ error: 'Failed to generate POD' });
  }
});

// Get outbound statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: outboundRecords.length,
      pending: outboundRecords.filter(r => r.status === 'pending').length,
      packaged: outboundRecords.filter(r => r.status === 'packaged').length,
      dispatched: outboundRecords.filter(r => r.status === 'dispatched').length,
      todayDispatched: outboundRecords.filter(r => 
        r.dispatchDate && r.dispatchDate.startsWith(new Date().toISOString().split('T')[0])
      ).length
    };

    res.json({ stats });

  } catch (error) {
    console.error('Outbound stats error:', error);
    res.status(500).json({ error: 'Failed to fetch outbound statistics' });
  }
});

module.exports = router;