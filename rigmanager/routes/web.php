<?php

use App\Http\Controllers\BuilderController;
use App\Models\Product;
use App\Models\Transaction; 
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController; 
use App\Http\Controllers\PosController; 
use App\Http\Controllers\TransactionController; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    
    // <-- EVERYONE CAN ACCESS THIS (Admins & Cashiers) -->
    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('/pos/checkout', [PosController::class, 'checkout'])->name('pos.checkout');

    Route::get('/builder', [BuilderController::class, 'index'])->name('builder.index');

    // <-- Dashboard Traffic Control -->
    Route::get('/dashboard', function () {
        // If you are just a cashier, go straight to the register!
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('pos.index');
        }

        // If you are an admin, load the analytics dashboard
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalAssets' => Product::get()->sum(fn($p) => $p->price * $p->stock),
                'totalItems' => (int) Product::sum('stock'),
                'lowStockItems' => Product::where('stock', '<=', 2)->latest()->get(),
                'totalRevenue' => Transaction::sum('total_amount'),
                'salesToday' => Transaction::whereDate('created_at', today())->sum('total_amount'),
                'recentTransactions' => Transaction::with('user')->latest()->take(5)->get()
            ]
        ]);
    })->name('dashboard');


    // <-- ADMIN ONLY ROUTES (Locked behind the Gate) -->
    Route::middleware('can:admin')->group(function () {
        // Ledger
        Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');

        // Inventory
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

        // Categories
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';