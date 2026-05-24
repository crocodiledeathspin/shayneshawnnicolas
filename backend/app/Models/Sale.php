<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    use HasFactory;

    protected $table = 'tbl_sales';
    protected $primaryKey = 'sale_id';

    protected $fillable = [
        'product_id',
        'user_id',
        'quantity',
        'unit_price',
        'total_amount',
        'sale_date',
        'notes',
        'is_deleted',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'sale_date' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function getRouteKeyName(): string
    {
        return 'sale_id';
    }
}
