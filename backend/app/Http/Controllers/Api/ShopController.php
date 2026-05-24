<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\N8nWebhookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{
    private function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone);
        if (str_starts_with($digits, '63') && strlen($digits) >= 12) {
            return '0' . substr($digits, 2);
        }
        if (strlen($digits) === 10 && str_starts_with($digits, '9')) {
            return '0' . $digits;
        }

        return $digits;
    }

    public function loadShopCategories()
    {
        $categories = Category::where('is_deleted', false)
            ->orderBy('category_name')
            ->get();

        return response()->json(['categories' => $categories], 200);
    }

    public function loadShopProducts(Request $request)
    {
        $categoryId = $request->input('category_id');

        $query = Product::with(['category'])
            ->where('is_deleted', false)
            ->where('stock_qty', '>', 0)
            ->orderBy('product_name');

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->get()->map(function ($product) {
            $product->product_image = $product->product_image
                ? url('storage/img/products/' . $product->product_image)
                : null;

            return $product;
        });

        return response()->json([
            'products' => $products,
            'delivery_fee' => (float) config('services.store.delivery_fee', 25),
            'delivery_area' => config('services.store.delivery_area', 'Roxas City, Capiz'),
        ], 200);
    }

    public function storeOrder(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'max:100'],
            'customer_phone' => ['required', 'max:20'],
            'customer_email' => ['nullable', 'email', 'max:100'],
            'fulfillment_type' => ['required', 'in:pickup,delivery'],
            'delivery_address' => ['required_if:fulfillment_type,delivery', 'nullable', 'max:500'],
            'delivery_landmark' => ['nullable', 'max:150'],
            'notes' => ['nullable', 'max:300'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:tbl_products,product_id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $deliveryFee = $validated['fulfillment_type'] === 'delivery'
            ? (float) config('services.store.delivery_fee', 25)
            : 0;

        try {
            $order = DB::transaction(function () use ($validated, $deliveryFee) {
            $subtotal = 0;
            $lineItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::where('product_id', $item['product_id'])
                    ->where('is_deleted', false)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($product->stock_qty < $item['quantity']) {
                    throw new \RuntimeException(
                        "Insufficient stock for {$product->product_name}. Available: {$product->stock_qty}"
                    );
                }

                $lineTotal = $product->price * $item['quantity'];
                $subtotal += $lineTotal;

                $lineItems[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'line_total' => $lineTotal,
                ];
            }

            $orderNumber = 'AR-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));

            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $this->normalizePhone($validated['customer_phone']),
                'customer_email' => $validated['customer_email'] ?? null,
                'fulfillment_type' => $validated['fulfillment_type'],
                'delivery_address' => $validated['delivery_address'] ?? null,
                'delivery_landmark' => $validated['delivery_landmark'] ?? null,
                'status' => 'pending',
                'payment_method' => 'cash',
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'total_amount' => $subtotal + $deliveryFee,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($lineItems as $line) {
                OrderItem::create([
                    'order_id' => $order->order_id,
                    'product_id' => $line['product']->product_id,
                    'product_name' => $line['product']->product_name,
                    'quantity' => $line['quantity'],
                    'unit_price' => $line['unit_price'],
                    'line_total' => $line['line_total'],
                ]);

                $line['product']->decrement('stock_qty', $line['quantity']);
            }

            return $order->load('items');
            });
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        N8nWebhookService::notifyOrderPlaced([
            'event' => 'order.placed',
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'customer_email' => $order->customer_email,
            'fulfillment_type' => $order->fulfillment_type,
            'delivery_address' => $order->delivery_address,
            'status' => $order->status,
            'total_amount' => $order->total_amount,
            'payment_method' => $order->payment_method,
            'items' => $order->items->map(fn ($i) => [
                'product_name' => $i->product_name,
                'quantity' => $i->quantity,
                'line_total' => $i->line_total,
            ])->values()->all(),
            'placed_at' => $order->created_at?->toIso8601String(),
        ]);

        return response()->json([
            'message' => 'Order placed successfully! We will prepare your order soon.',
            'order' => $order,
        ], 201);
    }

    public function trackOrder(Request $request)
    {
        $validated = $request->validate([
            'order_number' => ['required', 'string'],
            'customer_phone' => ['required', 'string'],
        ]);

        $phone = $this->normalizePhone($validated['customer_phone']);

        $order = Order::with(['items'])
            ->where('order_number', trim($validated['order_number']))
            ->where('customer_phone', $phone)
            ->where('is_deleted', false)
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found. Check your order number and phone.',
            ], 404);
        }

        return response()->json(['order' => $order], 200);
    }
}
