<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate; // <-- Add this
use App\Models\User; // <-- Add this

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Define the VIP rule: You are only an admin if your role is exactly 'admin'
        Gate::define('admin', function (User $user) {
            return $user->role === 'admin';
        });
    }
}