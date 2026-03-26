<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'distributor_id',
        'order_number',
        'items',
        'total_amount',
        'status',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the distributor that owns the order.
     */
    public function distributor()
    {
        return $this->belongsTo(Distributor::class);
    }

    /**
     * Get items as array.
     */
    public function getItemsArrayAttribute()
    {
        if (empty($this->items)) {
            return [];
        }
        return json_decode($this->items, true) ?? [];
    }

    /**
     * Generate unique order number.
     */
    public static function generateOrderNumber()
    {
        $prefix = 'ORD';
        $timestamp = now()->format('Ymd');
        $random = str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        return "{$prefix}-{$timestamp}-{$random}";
    }
}
