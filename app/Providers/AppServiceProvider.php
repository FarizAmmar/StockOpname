<?php

namespace App\Providers;

use App\Interfaces\Eloquent\TransactionsRepository;
use App\Interfaces\Repositories\TransactionsInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(TransactionsInterface::class, TransactionsRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
