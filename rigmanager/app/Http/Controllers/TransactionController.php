<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('Transactions/Index', [
            // Fetch all transactions, newest first, and include the name of the cashier
            'transactions' => Transaction::with('user')->latest()->get()
        ]);
    }
}