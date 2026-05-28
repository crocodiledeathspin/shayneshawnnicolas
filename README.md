# Jojo Store and Snackhouse — Web-Based Store Management System

**Business:** Sari-sari store (7 years) + Snack house (1 month)  
**Owners:** Jojo and Rhanzel Joi  
**Staff:** 2 employees (system accounts: `staff01`, `staff02`)

## Problems addressed

| Manual problem | System feature |
|----------------|----------------|
| Paper transactions | Digital sales + online orders |
| Lost / wrong utang (debt) | **Customer Debts** module with balance tracking |
| Hard to monitor stock | Products + low-stock alerts on dashboard |
| Slow sales monitoring | Dashboard stats, sales by category |
| Unorganized records | MySQL database, role-based staff access |

## Features

- **Digital order management** — Customer shop (`/shop`), staff Orders page
- **Inventory tracking** — Products, categories, reorder levels, low-stock count
- **Sales monitoring** — In-store sales recording + online order completion
- **Customer order records** — Order history, tracking by order number + phone
- **Customer debt (utang) records** — Record debt, partial/full payments, open balance
- **Staff management** — Owners + 2 staff roles (Sanctum API auth)
- **Product & category management** — Full CRUD for owners/staff
- **n8n automation (CC6)** — Webhook on new orders and status updates

## Privacy & accountability

- Customer data stored in a secured database; only logged-in staff access admin APIs
- Each debt record stores which staff member recorded it
- Owners (`jojo`, `rhanzel`) supervise reports; staff enter sales, orders, and debts

## Tech stack

- **Frontend:** React 19, Vite, Tailwind (`frontend/`)
- **Backend:** Laravel 12, Sanctum (`backend/`)
- **Database:** MySQL (`jojo_store_snackhouse` in `.env.example`)

## Setup

### 1. Database (XAMPP MySQL on)

```bash
cd backend
copy .env.example .env
php artisan key:generate
```

Set `DB_DATABASE` in `.env` (create database in phpMyAdmin if needed).

```bash
php artisan migrate:fresh --seed --force
php artisan storage:link
php artisan serve
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### 3. Login accounts (after seed)

| Role | Username | Password |
|------|----------|----------|
| Owner | `jojo` | `jojo123` |
| Owner | `rhanzel` | `rhanzel123` |
| Staff | `staff01` | `staff123` |
| Staff | `staff02` | `staff123` |

### 4. Customer shop

http://localhost:5173/shop — no login; checkout with name + phone; track orders at `/shop/track`

### 5. n8n (optional)

See `automation/README.md` — set `N8N_WEBHOOK_URL` to your webhook path `jojo-store-order`.

## Product categories (seed)

1. Sari-Sari Essentials  
2. Snack House  
3. Beverages  
4. Frozen Products  

## Note on existing databases

If you already use `aling_rosa_store`, you may keep that name in `.env` or rename the database to `jojo_store_snackhouse` and re-run migrations.
