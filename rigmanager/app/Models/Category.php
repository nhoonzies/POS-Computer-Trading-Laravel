<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    // Tell Laravel it is safe to auto-fill these columns
    protected $fillable = [
        'name',
        'slug',
    ];
    
    // Tell Laravel that a category has many products
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}