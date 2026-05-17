<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['user_id', 'total_amount', 'items'];

    // Automatically convert the JSON text back into a usable array in PHP
    protected $casts = [
        'items' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class); // Connects the transaction to the cashier
    }
}