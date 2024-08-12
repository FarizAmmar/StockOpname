<?php

// Dashboard

use App\Http\Controllers\Product\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Dashboard
Route::get('/', function () {
    return Inertia::render('Home/Dashboard');
})->middleware('auth')->name('dashboard');

// Product
Route::prefix('/product')->middleware('auth')->name('product.')->group(function () {
    // Index
    Route::get('/', [ProductController::class, 'index'])->name('index');
});

require __DIR__ . '/auth.php';
