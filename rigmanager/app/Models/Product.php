<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// (Leave any other 'use' statements that are already at the top)

class Product extends Model
{
    // 1. Tell Laravel which columns we are allowed to save data to
    protected $fillable = [
        'category_id', 'name', 'sku', 'price', 'stock', 'specs', 'condition', 'compatibility_tag'
    ];

    // 2. Tell Laravel that every product belongs to one category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}