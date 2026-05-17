<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Categories/Index', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name), 
        ]);

        return redirect()->back(); 
    }

    // <-- NEW: Handle Edits -->
    public function update(Request $request, Category $category)
    {
        $request->validate([
            // Ignore THIS category's ID when checking if the name is unique
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name), // Update the slug to match the new name
        ]);

        return redirect()->back();
    }

    // <-- NEW: Handle Deletions -->
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->back();
    }
}