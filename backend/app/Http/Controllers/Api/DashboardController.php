<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerDebt;
use App\Models\Order;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        $todaySales = Sale::where('is_deleted', false)
            ->whereDate('sale_date', today())
            ->sum('total_amount');

        $todayTransactions = Sale::where('is_deleted', false)
            ->whereDate('sale_date', today())
            ->count();

        $totalProducts = Product::where('is_deleted', false)->count();

        $lowStockCount = Product::where('is_deleted', false)
            ->whereColumn('stock_qty', '<=', 'reorder_level')
            ->count();

        $pendingOrders = Order::where('is_deleted', false)
            ->where('status', 'pending')
            ->count();

        $openDebtCount = CustomerDebt::where('is_deleted', false)
            ->where('status', 'open')
            ->count();

        $openDebtBalance = CustomerDebt::where('is_deleted', false)
            ->where('status', 'open')
            ->selectRaw('COALESCE(SUM(amount - amount_paid), 0) as total')
            ->value('total') ?? 0;

        $salesByCategory = Sale::where('tbl_sales.is_deleted', false)
            ->whereDate('tbl_sales.sale_date', today())
            ->join('tbl_products', 'tbl_sales.product_id', '=', 'tbl_products.product_id')
            ->join('tbl_categories', 'tbl_products.category_id', '=', 'tbl_categories.category_id')
            ->select('tbl_categories.category_name', DB::raw('SUM(tbl_sales.total_amount) as total'))
            ->groupBy('tbl_categories.category_name')
            ->get();

        return response()->json([
            'today_sales' => number_format($todaySales, 2, '.', ''),
            'today_transactions' => $todayTransactions,
            'total_products' => $totalProducts,
            'low_stock_count' => $lowStockCount,
            'pending_orders' => $pendingOrders,
            'open_debt_count' => $openDebtCount,
            'open_debt_balance' => number_format((float) $openDebtBalance, 2, '.', ''),
            'sales_by_category' => $salesByCategory,
        ], 200);
    }
}
