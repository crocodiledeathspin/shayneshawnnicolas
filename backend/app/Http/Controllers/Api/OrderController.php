<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Sale;
use App\Services\N8nWebhookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function loadOrders(Request $request)
    {
        $status = $request->input('status');
        $search = $request->input('search', '');

        $query = Order::with(['items', 'handler'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate(15)->appends($request->query());

        return response()->json([
            'orders' => $orders->items(),
            'current_page' => $orders->currentPage(),
            'last_page' => $orders->lastPage(),
            'has_more_pages' => $orders->hasMorePages(),
        ], 200);
    }

    public function getOrder(Order $order)
    {
        $order->load(['items.product', 'handler']);

        return response()->json(['order' => $order], 200);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,accepted,preparing,ready_for_pickup,out_for_delivery,completed,cancelled'],
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        DB::transaction(function () use ($request, $order, $newStatus) {
            if ($newStatus === 'completed' && $order->status !== 'completed') {
                foreach ($order->items as $item) {
                    Sale::create([
                        'product_id' => $item->product_id,
                        'user_id' => $request->user()->user_id,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_amount' => $item->line_total,
                        'sale_date' => now(),
                        'notes' => 'Order ' . $order->order_number,
                    ]);
                }
            }

            if ($newStatus === 'cancelled' && !in_array($order->status, ['cancelled', 'completed'])) {
                foreach ($order->items as $item) {
                    Product::where('product_id', $item->product_id)->increment('stock_qty', $item->quantity);
                }
            }

            $order->update([
                'status' => $newStatus,
                'handled_by' => $request->user()->user_id,
            ]);
        });

        $order->refresh()->load('items');

        N8nWebhookService::notifyOrderPlaced([
            'event' => 'order.status_updated',
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'customer_email' => $order->customer_email,
            'old_status' => $oldStatus,
            'status' => $order->status,
            'fulfillment_type' => $order->fulfillment_type,
            'total_amount' => $order->total_amount,
        ]);

        return response()->json([
            'message' => 'Order status updated.',
            'order' => $order,
        ], 200);
    }
}
