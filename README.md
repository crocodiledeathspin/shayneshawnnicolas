# Aling Rosa's Sari-Sari, Street Food & Shakes — Management System

**Business:** Aling Rosa's Sari-Sari, Street Food & Shakes  
**Location:** Roxas City, Capiz  
**Purpose:** Academic IT9 Web Development project (preparation for thesis/capstone) and IT10 Mobile Development integration

## Business Problems Addressed

| Problem | Solution in System |
|---------|-------------------|
| Manual inventory tracking, items run out unnoticed | Product inventory with stock levels and low-stock highlighting |
| Mixed products (street food, shakes, groceries) hard to organize | Category-based product management |
| Daily sales not recorded digitally | Sales module with automatic stock deduction |
| No overview of daily performance | Dashboard with today's sales, transactions, and category breakdown |

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4
- **Backend:** Laravel 12 + Sanctum API authentication
- **Database:** MySQL

## Project Structure

```
shayneshawnnicolas/
├── backend/          # Laravel API
├── frontend/         # React SPA
└── README.md
```

## Setup Instructions

### 1. Database (XAMPP MySQL)

Create database in phpMyAdmin:

```sql
CREATE DATABASE aling_rosa_store;
```

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env   # if .env does not exist
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

API runs at: `http://127.0.0.1:8000/api`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Web app runs at: `http://localhost:5173`

## Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Owner | `owner` | `owner123` |
| Staff | `staff01` | `staff123` |

## API Endpoints (for Flutter Mobile Integration)

Base URL: `http://127.0.0.1:8000/api`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login (returns token) |
| GET | `/auth/me` | Current user (Bearer token) |
| POST | `/auth/logout` | Logout |

### Categories
| Method | Endpoint |
|--------|----------|
| GET | `/category/loadCategories` |
| POST | `/category/storeCategory` |
| PUT | `/category/updateCategory/{id}` |
| PUT | `/category/destroyCategory/{id}` |

### Products
| Method | Endpoint |
|--------|----------|
| GET | `/product/loadProducts?page=1&search=` |
| GET | `/product/loadLowStockProducts` |
| POST | `/product/storeProduct` |
| POST | `/product/updateProduct/{id}` |
| PUT | `/product/destroyProduct/{id}` |

### Sales
| Method | Endpoint |
|--------|----------|
| GET | `/sale/loadSales` |
| POST | `/sale/storeSale` |
| PUT | `/sale/destroySale/{id}` |

### Dashboard
| Method | Endpoint |
|--------|----------|
| GET | `/dashboard/getStats` |

### Staff
| Method | Endpoint |
|--------|----------|
| GET | `/staff/loadStaff` |
| POST | `/staff/storeStaff` |
| PUT | `/staff/updateStaff/{id}` |
| PUT | `/staff/destroyStaff/{id}` |

All endpoints except `/auth/login` require header:  
`Authorization: Bearer {token}`

## Mobile App (Flutter) Integration Notes

Your Flutter app should:
1. Use the **same MySQL database** via this Laravel API (do not create a separate backend)
2. Implement login with `/auth/login` and store the Sanctum token
3. Implement 2–3 core actions: e.g. record sale, view products, view low stock
4. Use GET, POST, PUT, DELETE against the endpoints above
5. Match branding (orange theme) with the web system

## Features

### Customer (no login required)
- **Online shop** at `/shop` — browse products with images
- **Cart & checkout** — pickup or delivery (Roxas City)
- **Guest checkout** — name + phone only (no account)
- **Track order** — order number + phone at `/shop/track`
- **Cash payment** on pickup or delivery

### Admin (staff login required)
- **Dashboard** — sales, pending orders, low stock
- **Orders** — accept, prepare, ready/delivery, complete, cancel
- **Categories** — CRUD for Street Food, Shakes, Snacks, etc.
- **Products** — inventory with images, price, stock, reorder level
- **Sales** — walk-in sales (manual record)
- **Staff** — owner/staff accounts

## Customer vs Staff URLs

| Who | URL | Login? |
|-----|-----|--------|
| Customer | http://localhost:5173/shop | **No** |
| Staff/Owner | http://localhost:5173/ | Yes (`owner` / `owner123`) |

## n8n Automation (CC6)

1. Install and run [n8n](https://n8n.io)
2. Import `automation/n8n-order-notification.json`
3. Activate the workflow and copy the **Webhook URL**
4. Add to `backend/.env`:
   ```
   N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/aling-rosa-order
   STORE_DELIVERY_FEE=25
   STORE_DELIVERY_AREA="Roxas City, Capiz"
   ```
5. Configure SMTP in the email node (or swap for Telegram)
6. Place a test order — n8n receives `order.placed` payload automatically

### Public shop API (no auth)
| Method | Endpoint |
|--------|----------|
| GET | `/api/shop/loadShopProducts` |
| POST | `/api/shop/storeOrder` |
| GET | `/api/shop/trackOrder?order_number=&customer_phone=` |

### Admin orders API (auth required)
| Method | Endpoint |
|--------|----------|
| GET | `/api/order/loadOrders` |
| PUT | `/api/order/updateOrderStatus/{id}` |

## Sample Seed Data

Includes categories (Street Food, Shakes, Snacks, Groceries, Beverages), 12 sample products, and 2 staff accounts. Some products are intentionally low-stock for testing alerts.
