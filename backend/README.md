# Optima WMS Backend API

A comprehensive Node.js Express API for the Optima Warehouse Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL database
- Environment variables configured (see `.env.example`)

### Installation
```bash
# Clone and setup
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database and API credentials

# Start development server
npm run dev

# Start production server
npm start
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication Endpoints

### POST `/auth/login`
**Purpose**: User authentication
```json
{
  "email": "admin@optima.com",
  "password": "admin123"
}
```
**Response**:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "admin@optima.com",
    "role": "admin",
    "name": "Sarah Admin"
  }
}
```

### POST `/auth/register`
**Purpose**: Create new user (admin only)
```json
{
  "email": "new@user.com",
  "password": "password123",
  "role": "employee",
  "name": "New Employee",
  "vendorId": "VENDOR001" // Optional for vendors
}
```

### POST `/auth/logout`
**Purpose**: User logout

### GET `/auth/verify`
**Purpose**: Verify JWT token
**Headers**: `Authorization: Bearer <token>`

---

## 👥 User Management Endpoints

### GET `/users`
**Purpose**: Get all users (admin only)
**Query Parameters**:
- `role`: Filter by role (admin/manager/employee/vendor)
- `isActive`: Filter by status (true/false)

### GET `/users/:id`
**Purpose**: Get user by ID

### PUT `/users/:id`
**Purpose**: Update user details
```json
{
  "name": "Updated Name",
  "email": "updated@email.com",
  "role": "manager",
  "isActive": true
}
```

### DELETE `/users/:id`
**Purpose**: Soft delete user (set inactive)

### GET `/users/role/:role`
**Purpose**: Get users by specific role

### GET `/users/stats/overview`
**Purpose**: Get user statistics

---

## 📦 Inventory Management Endpoints

### GET `/inventory`
**Purpose**: Get all inventory items
**Query Parameters**:
- `vendorId`: Filter by vendor
- `status`: Filter by status (normal/low/critical)
- `search`: Search by SKU or product name

### GET `/inventory/sku/:sku`
**Purpose**: Get specific item by SKU

### POST `/inventory`
**Purpose**: Create new inventory item
```json
{
  "sku": "SKU001",
  "product": "Wireless Headphones",
  "vendorId": "VENDOR001",
  "vendorName": "TechCorp Electronics",
  "initialStock": 100
}
```

### PUT `/inventory/stock/:sku`
**Purpose**: Update stock levels
```json
{
  "quantity": 50,
  "operation": "add", // add/subtract/set
  "reason": "Inbound received"
}
```

### GET `/inventory/alerts/low-stock`
**Purpose**: Get low stock alerts

---

## 📥 Inbound Operations Endpoints

### GET `/inbound`
**Purpose**: Get all inbound records
**Query Parameters**:
- `status`: Filter by status (pending/completed/partial/rejected)
- `vendorId`: Filter by vendor
- `date`: Filter by date (YYYY-MM-DD)

### GET `/inbound/awb/:awb`
**Purpose**: Get inbound record by AWB

### POST `/inbound`
**Purpose**: Create new inbound record
```json
{
  "awb": "AWB123456789",
  "vendorId": "VENDOR001",
  "vendorName": "TechCorp Electronics",
  "sku": "SKU001",
  "product": "Wireless Headphones",
  "quantity": 50,
  "notes": "Expected delivery today"
}
```

### POST `/inbound/scan`
**Purpose**: Process inbound scanning (employee action)
```json
{
  "awb": "AWB123456789",
  "scannedBy": "Mike Employee",
  "receivedQuantity": 48,
  "notes": "2 items damaged"
}
```

### GET `/inbound/pending`
**Purpose**: Get pending inbound items

### GET `/inbound/stats`
**Purpose**: Get inbound statistics

---

## 📤 Outbound Operations Endpoints

### GET `/outbound`
**Purpose**: Get all outbound records
**Query Parameters**:
- `status`: Filter by status (pending/packaged/dispatched)
- `vendorId`: Filter by vendor
- `courier`: Filter by courier
- `date`: Filter by date

### GET `/outbound/awb/:awb`
**Purpose**: Get outbound record by AWB

### POST `/outbound`
**Purpose**: Create new outbound order
```json
{
  "awb": "OUT123456789",
  "vendorId": "VENDOR001",
  "vendorName": "TechCorp Electronics",
  "sku": "SKU001",
  "product": "Wireless Headphones",
  "quantity": 5,
  "notes": "Handle with care"
}
```

### POST `/outbound/package`
**Purpose**: Process packaging (employee action)
```json
{
  "awb": "OUT123456789",
  "packagedBy": "Sarah Packer",
  "notes": "Packed securely"
}
```

### POST `/outbound/dispatch`
**Purpose**: Assign courier and dispatch
```json
{
  "awb": "OUT123456789",
  "courierName": "BlueDart",
  "trackingNumber": "BD123456789"
}
```

### GET `/outbound/courier-groups`
**Purpose**: Group packages by courier

### GET `/outbound/pod/:awb`
**Purpose**: Generate POD (Proof of Dispatch)

### GET `/outbound/stats`
**Purpose**: Get outbound statistics

---

## 🔄 Returns Management Endpoints

### GET `/returns`
**Purpose**: Get all returns records
**Query Parameters**:
- `status`: Filter by status (pending/processing/resolved/damaged)
- `vendorId`: Filter by vendor
- `condition`: Filter by condition (good/damaged/defective/expired)
- `date`: Filter by date

### GET `/returns/:returnId`
**Purpose**: Get return record by ID

### POST `/returns`
**Purpose**: Create new return record
```json
{
  "returnId": "RET001",
  "originalAwb": "OUT123456789",
  "vendorId": "VENDOR001",
  "vendorName": "TechCorp Electronics",
  "sku": "SKU001",
  "product": "Wireless Headphones",
  "quantity": 1,
  "reason": "Damaged in transit",
  "condition": "damaged",
  "notes": "Package was crushed"
}
```

### POST `/returns/scan`
**Purpose**: Process return scanning (employee action)
```json
{
  "returnId": "RET001",
  "receivedBy": "Mike Returns",
  "condition": "damaged",
  "restockedQuantity": 0,
  "notes": "Item cannot be resold"
}
```

### GET `/returns/pending`
**Purpose**: Get pending returns

### GET `/returns/damaged`
**Purpose**: Get damaged/rejected returns

### GET `/returns/stats`
**Purpose**: Get returns statistics

---

## 📊 Dashboard Endpoints

### GET `/dashboard/stats/:role`
**Purpose**: Get role-specific dashboard statistics
**Roles**: admin, manager, employee, vendor

### GET `/dashboard/activities`
**Purpose**: Get recent system activities

### GET `/dashboard/employee-activity`
**Purpose**: Get employee activity status

### GET `/dashboard/vendor-summary`
**Purpose**: Get vendor operations summary

---

## 📈 Reports Endpoints

### GET `/reports/daily`
**Purpose**: Generate daily operations report
**Query Parameters**: `date` (YYYY-MM-DD)

### GET `/reports/weekly`
**Purpose**: Generate weekly operations report
**Query Parameters**: `startDate`, `endDate`

### GET `/reports/monthly`
**Purpose**: Generate monthly operations report
**Query Parameters**: `month`, `year`

### GET `/reports/vendor/:vendorId`
**Purpose**: Generate vendor-specific report
**Query Parameters**: `startDate`, `endDate`

### GET `/reports/employee/:employeeId`
**Purpose**: Generate employee performance report
**Query Parameters**: `startDate`, `endDate`

### POST `/reports/export`
**Purpose**: Export report data
```json
{
  "reportType": "daily",
  "format": "csv",
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

---

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs validated using express-validator
- **CORS Protection**: Configured for frontend origin
- **Helmet Security**: Security headers middleware
- **Password Hashing**: bcrypt for password security

---

## 📝 Data Models

### User
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "admin|manager|employee|vendor",
  "name": "User Name",
  "isActive": true,
  "vendorId": "VENDOR001", // For vendors only
  "createdAt": "2024-01-15T10:00:00Z",
  "lastLogin": "2024-01-15T10:00:00Z"
}
```

### Inventory Item
```json
{
  "id": 1,
  "sku": "SKU001",
  "product": "Product Name",
  "vendorId": "VENDOR001",
  "vendorName": "Vendor Name",
  "currentStock": 45,
  "inboundToday": 12,
  "outboundToday": 8,
  "reservedStock": 5,
  "status": "normal|low|critical",
  "lastUpdated": "2024-01-15T10:00:00Z"
}
```

### Inbound Record
```json
{
  "id": 1,
  "awb": "AWB123456789",
  "vendorId": "VENDOR001",
  "sku": "SKU001",
  "quantity": 50,
  "receivedQuantity": 48,
  "status": "pending|completed|partial|rejected",
  "scannedBy": "Employee Name",
  "receivedDate": "2024-01-15T10:00:00Z",
  "notes": "Additional notes"
}
```

### Outbound Record
```json
{
  "id": 1,
  "awb": "OUT123456789",
  "vendorId": "VENDOR001",
  "sku": "SKU001",
  "quantity": 5,
  "courierName": "BlueDart",
  "trackingNumber": "BD123456789",
  "status": "pending|packaged|dispatched",
  "packagedBy": "Employee Name",
  "packagedDate": "2024-01-15T10:00:00Z",
  "dispatchDate": "2024-01-15T10:00:00Z",
  "podGenerated": true
}
```

### Return Record
```json
{
  "id": 1,
  "returnId": "RET001",
  "originalAwb": "OUT123456789",
  "vendorId": "VENDOR001",
  "sku": "SKU001",
  "quantity": 1,
  "reason": "Damaged in transit",
  "condition": "good|damaged|defective|expired",
  "status": "pending|processing|resolved|damaged",
  "receivedBy": "Employee Name",
  "receivedDate": "2024-01-15T10:00:00Z",
  "restockedQuantity": 0
}
```

---

## 🔧 Environment Variables

```bash
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/optima_wms

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h

# Email/SMS/WhatsApp (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMS_API_KEY=your_sms_api_key
WHATSAPP_TOKEN=your_whatsapp_token
```

---

## 🚦 Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [ /* validation errors if any */ ]
}
```

### Validation Error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 📦 Deployment

### Docker
```bash
# Build image
docker build -t optima-wms-backend .

# Run container
docker run -p 5000:5000 optima-wms-backend
```

### PM2 (Production)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "optima-wms-api"

# Monitor
pm2 monitor
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

---

## 📄 License

MIT License - see LICENSE file for details