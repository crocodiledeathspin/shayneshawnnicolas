<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerDebt extends Model
{
    protected $table = 'tbl_customer_debts';
    protected $primaryKey = 'debt_id';

    protected $fillable = [
        'customer_name',
        'customer_phone',
        'amount',
        'amount_paid',
        'description',
        'debt_date',
        'status',
        'recorded_by',
        'paid_at',
        'is_deleted',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'debt_date' => 'date',
        'paid_at' => 'datetime',
    ];

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by', 'user_id');
    }

    public function getBalanceAttribute(): float
    {
        return max(0, (float) $this->amount - (float) $this->amount_paid);
    }

    public function getRouteKeyName(): string
    {
        return 'debt_id';
    }
}
