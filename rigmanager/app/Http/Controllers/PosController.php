<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction; // <-- Added the Transaction model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PosController extends Controller
{
    public function index()
    {
        // Only fetch products that actually have stock > 0
        return Inertia::render('Pos/Index', [
            'products' => Product::with('category')->where('stock', '>', 0)->latest()->get(),
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'cart' => 'required|array',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric',
        ]);

        // Wrap in a transaction to prevent partial sales if an error occurs
        DB::transaction(function () use ($request) {
            $totalAmount = 0;
            $snapshotItems = [];

            foreach ($request->cart as $item) {
                $product = Product::find($item['id']);

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Not enough stock for {$product->name}");
                }

                // 1. Deduct Stock
                $product->stock -= $item['quantity'];
                $product->save();

                // 2. Calculate Total
                $lineTotal = $item['price'] * $item['quantity'];
                $totalAmount += $lineTotal;

                // 3. Create a snapshot of the item for the receipt
                $snapshotItems[] = [
                    'product_id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'line_total' => $lineTotal,
                ];
            }

            // 4. Save the permanent receipt to the ledger
            Transaction::create([
                'user_id' => auth()->id(),
                'total_amount' => $totalAmount,
                'items' => $snapshotItems,
            ]);
        });

        return redirect()->back(); // Reloads the page with fresh inventory numbers
    }
}