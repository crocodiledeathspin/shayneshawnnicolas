<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class OrderStatusService
{
    private const TRANSITIONS = [
        'pending' => ['accepted', 'cancelled'],
        'accepted' => ['preparing', 'cancelled'],
        'preparing' => ['ready_for_pickup', 'out_for_delivery', 'cancelled'],
        'ready_for_pickup' => ['completed', 'cancelled'],
        'out_for_delivery' => ['completed', 'cancelled'],
        'completed' => [],
        'cancelled' => [],
    ];

    public function validateTransition(Order $order, string $newStatus): void
    {
        if ($order->status === $newStatus) {
            return;
        }

        $allowed = self::TRANSITIONS[$order->status] ?? [];

        if (!in_array($newStatus, $allowed, true)) {
            throw new InvalidArgumentException(
                "Cannot change status from {$order->status} to {$newStatus}."
            );
        }

        if ($newStatus === 'ready_for_pickup' && $order->fulfillment_type !== 'pickup') {
            throw new InvalidArgumentException('Ready for pickup is only for pickup orders.');
        }

        if ($newStatus === 'out_for_delivery' && $order->fulfillment_type !== 'delivery') {
            throw new InvalidArgumentException('Out for delivery is only for delivery orders.');
        }
    }

    public function applyTransition(Order $order, string $newStatus, int $userId): void
    {
        if ($order->status === $newStatus) {
            return;
        }

        $this->validateTransition($order, $newStatus);

        DB::transaction(function () use ($order, $newStatus, $userId) {
            $order->load('items');

            if ($newStatus === 'completed') {
                $alreadyRecorded = Sale::where('order_id', $order->order_id)
                    ->where('is_deleted', false)
                    ->exists();

                if (!$alreadyRecorded) {
                    foreach ($order->items as $item) {
                        Sale::create([
                            'order_id' => $order->order_id,
                            'product_id' => $item->product_id,
                            'user_id' => $userId,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'total_amount' => $item->line_total,
                            'sale_date' => now(),
                            'notes' => 'Order ' . $order->order_number,
                        ]);
                    }
                }
            }

            if ($newStatus === 'cancelled') {
                foreach ($order->items as $item) {
                    Product::where('product_id', $item->product_id)
                        ->increment('stock_qty', $item->quantity);
                }

                Sale::where('order_id', $order->order_id)
                    ->where('is_deleted', false)
                    ->update(['is_deleted' => true]);
            }

            $order->update([
                'status' => $newStatus,
                'handled_by' => $userId,
            ]);
        });
    }
}
