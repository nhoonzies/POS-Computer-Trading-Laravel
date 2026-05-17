<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class BuilderController extends Controller
{
    public function index()
    {
        // We fetch all categories and eagerly load their products (only items in stock)
        $categories = Category::with(['products' => function ($query) {
            $query->where('stock', '>', 0)->orderBy('price', 'asc');
        }])->get();

        return Inertia::render('Builder/Index', [
            'categories' => $categories
        ]);
    }
}