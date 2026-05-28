# n8n Automation Setup (CC6)

## How it works

```
Customer places order (React /shop)
        ↓
Laravel API saves order (ShopController)
        ↓
N8nWebhookService sends HTTP POST → your n8n Webhook URL
        ↓
n8n workflow runs (notify staff / email customer / etc.)
```

Staff updates order status → same webhook with `event: order.status_updated`.

## Why it might "not work"

| Problem | Fix |
|---------|-----|
| `N8N_WEBHOOK_URL` empty in `.env` | Laravel **silently skips** the webhook. Set the URL and restart `php artisan serve`. |
| n8n workflow not **Activated** | Toggle must be **ON** (green) in n8n. |
| Wrong webhook URL | Use **Production URL** from Webhook node (not Test URL when testing live site). |
| n8n not running | Start n8n (`npx n8n` or Docker) before testing. |
| Old workflow used `$json.body.event` | Fixed — Laravel sends fields at **root**: `$json.event` |

## Step-by-step setup

### 1. Install and run n8n

```bash
npx n8n
```

Open http://localhost:5678

### 2. Import workflow

- **Workflows** → **Import from File**
- Choose `automation/n8n-order-notification.json`

### 3. Activate workflow

- Open the workflow
- Toggle **Active** ON (top right)

### 4. Copy webhook URL

- Click **Webhook** node
- Copy **Production URL**, example:
  `http://localhost:5678/webhook/jojo-store-order`

### 5. Configure Laravel

Edit `backend/.env`:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/jojo-store-order
```

Restart backend:

```bash
cd backend
php artisan config:clear
php artisan serve
```

### 6. Test

1. Place an order at http://localhost:5173/shop
2. In n8n → **Executions** — you should see a successful run
3. Open execution → see `event: order.placed`, order number, customer info

### 7. Optional: email

- Enable **Email Customer** node in n8n
- Add SMTP credentials (Gmail app password, etc.)
- Customer must enter email at checkout

## Payload Laravel sends

**New order:**
```json
{
  "event": "order.placed",
  "order_number": "JS-20260524-ABC123",
  "customer_name": "Juan",
  "customer_phone": "09171234567",
  "fulfillment_type": "pickup",
  "total_amount": "150.00",
  "items": [...]
}
```

**Status update:**
```json
{
  "event": "order.status_updated",
  "order_number": "JS-...",
  "old_status": "preparing",
  "status": "ready_for_pickup",
  ...
}
```

## Demo without email (for presentation)

The **Format New Order** / **Format Status Update** nodes are enough for CC6 demo — show n8n **Executions** after placing an order. Email is optional.

## Check Laravel logs

If webhook fails, see `backend/storage/logs/laravel.log` for `n8n webhook failed`.
