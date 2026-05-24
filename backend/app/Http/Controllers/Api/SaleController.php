<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function loadSales(Request $request)
    {
        $page = $request->input('page', 1);
        $search = $request->input('search', '');

        $query = Sale::with(['product.category', 'user'])
            ->where('is_deleted', false)
            ->orderBy('sale_date', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('product', fn ($p) => $p->where('product_name', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn ($u) => $u->where('full_name', 'like', "%{$search}%"));
            });
        }

        $sales = $query->paginate(15)->appends($request->query());

        return response()->json([
            'sales' => $sales->items(),
            'current_page' => $sales->currentPage(),
            'last_page' => $sales->lastPage(),
            'has_more_pages' => $sales->hasMorePages(),
        ], 200);
    }

    public function storeSale(Request $request)
    {
        $validated = $request->validate([
            'product' => ['required', 'exists:tbl_products,product_id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'max:200'],
        ]);

        $product = Product::where('product_id', $validated['product'])
            ->where('is_deleted', false)
            ->firstOrFail();

        if ($product->stock_qty < $validated['quantity']) {
            return response()->json([
                'message' => 'Insufficient stock. Available: ' . $product->stock_qty,
            ], 422);
        }

        $unitPrice = $product->price;
        $totalAmount = $unitPrice * $validated['quantity'];

        DB::transaction(function () use ($request, $validated, $product, $unitPrice, $totalAmount) {
            Sale::create([
                'product_id' => $validated['product'],
                'user_id' => $request->user()->user_id,
                'quantity' => $validated['quantity'],
                'unit_price' => $unitPrice,
                'total_amount' => $totalAmount,
                'sale_date' => now(),
                'notes' => $validated['notes'] ?? null,
            ]);

            $product->decrement('stock_qty', $validated['quantity']);
        });

        return response()->json([
            'message' => 'Sale Successfully Recorded.',
        ], 200);
    }

    public function destroySale(Sale $sale)
    {
        DB::transaction(function () use ($sale) {
            $product = Product::find($sale->product_id);
            if ($product) {
                $product->increment('stock_qty', $sale->quantity);
            }
            $sale->update(['is_deleted' => true]);
        });

        return response()->json([
            'message' => 'Sale Successfully Cancelled.',
        ], 200);
    }
}
