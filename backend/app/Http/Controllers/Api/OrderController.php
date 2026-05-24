<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\N8nWebhookService;
use App\Services\OrderStatusService;
use Illuminate\Http\Request;
use InvalidArgumentException;

class OrderController extends Controller
{
    public function __construct(
        private OrderStatusService $orderStatusService
    ) {}

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
        if ($order->is_deleted) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $order->load(['items.product', 'handler']);

        return response()->json(['order' => $order], 200);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        if ($order->is_deleted) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:pending,accepted,preparing,ready_for_pickup,out_for_delivery,completed,cancelled'],
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        try {
            $this->orderStatusService->applyTransition(
                $order,
                $newStatus,
                $request->user()->user_id
            );
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

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
