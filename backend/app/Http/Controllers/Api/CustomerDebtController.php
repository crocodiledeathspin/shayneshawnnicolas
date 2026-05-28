<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerDebt;
use App\Support\PhoneNormalizer;
use Illuminate\Http\Request;

class CustomerDebtController extends Controller
{
    public function loadDebts(Request $request)
    {
        $status = $request->input('status', 'all');
        $search = $request->input('search', '');

        $query = CustomerDebt::with('recorder')
            ->where('is_deleted', false)
            ->orderBy('debt_date', 'desc')
            ->orderBy('debt_id', 'desc');

        if ($status === 'open') {
            $query->where('status', 'open');
        } elseif ($status === 'paid') {
            $query->where('status', 'paid');
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $debts = $query->paginate(15)->appends($request->query());

        $openBalance = CustomerDebt::where('is_deleted', false)
            ->where('status', 'open')
            ->selectRaw('SUM(amount - amount_paid) as total')
            ->value('total') ?? 0;

        return response()->json([
            'debts' => $debts->items(),
            'current_page' => $debts->currentPage(),
            'last_page' => $debts->lastPage(),
            'has_more_pages' => $debts->hasMorePages(),
            'open_balance_total' => number_format((float) $openBalance, 2, '.', ''),
            'open_debt_count' => CustomerDebt::where('is_deleted', false)->where('status', 'open')->count(),
        ], 200);
    }

    public function storeDebt(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'max:120'],
            'customer_phone' => ['nullable', 'max:20'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'max:255'],
            'debt_date' => ['nullable', 'date'],
        ]);

        $phone = !empty($validated['customer_phone'])
            ? PhoneNormalizer::normalize($validated['customer_phone'])
            : null;

        CustomerDebt::create([
            'customer_name' => trim($validated['customer_name']),
            'customer_phone' => $phone,
            'amount' => $validated['amount'],
            'amount_paid' => 0,
            'description' => $validated['description'] ?? null,
            'debt_date' => $validated['debt_date'] ?? now()->toDateString(),
            'status' => 'open',
            'recorded_by' => $request->user()->user_id,
        ]);

        return response()->json([
            'message' => 'Customer debt recorded successfully.',
        ], 200);
    }

    public function recordPayment(Request $request, CustomerDebt $debt)
    {
        if ($debt->is_deleted) {
            return response()->json(['message' => 'Debt record not found.'], 404);
        }

        if ($debt->status === 'paid') {
            return response()->json(['message' => 'This debt is already fully paid.'], 422);
        }

        $validated = $request->validate([
            'payment_amount' => ['required', 'numeric', 'min:0.01'],
        ]);

        $balance = (float) $debt->amount - (float) $debt->amount_paid;

        if ($validated['payment_amount'] > $balance + 0.001) {
            return response()->json([
                'message' => 'Payment exceeds remaining balance (₱' . number_format($balance, 2) . ').',
            ], 422);
        }

        $newPaid = (float) $debt->amount_paid + (float) $validated['payment_amount'];
        $isFullyPaid = $newPaid >= (float) $debt->amount - 0.001;

        $debt->update([
            'amount_paid' => $newPaid,
            'status' => $isFullyPaid ? 'paid' : 'open',
            'paid_at' => $isFullyPaid ? now() : null,
        ]);

        return response()->json([
            'message' => $isFullyPaid
                ? 'Debt marked as fully paid.'
                : 'Partial payment recorded.',
            'debt' => $debt->fresh()->load('recorder'),
        ], 200);
    }

    public function destroyDebt(CustomerDebt $debt)
    {
        if ($debt->is_deleted) {
            return response()->json(['message' => 'Debt record not found.'], 404);
        }

        $debt->update(['is_deleted' => true]);

        return response()->json([
            'message' => 'Debt record removed.',
        ], 200);
    }
}
