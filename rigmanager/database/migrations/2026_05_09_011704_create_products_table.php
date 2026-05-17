<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->foreignId('category_id')->constrained()->onDelete('cascade');
        $table->string('name');
        $table->string('sku')->unique(); // The unique "Part Number"
        $table->decimal('price', 10, 2); // Handles prices like 15000.50
        $table->integer('stock')->default(0); // This is our source of truth for stock!
        $table->json('specs')->nullable(); // For our "Smart Specs" logic later
        $table->enum('condition', ['new', 'used', 'refurbished'])->default('new');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
