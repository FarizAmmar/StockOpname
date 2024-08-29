<?php

// Dashboard

use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Transaction\TransactionController;
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

    // Store
    Route::post('/store', [ProductController::class, 'store'])->name('store');

    // Store
    Route::get('/edit/{id}', [ProductController::class, 'edit'])->name('edit');

    // Update
    Route::post('/update/{id}', [ProductController::class, 'update'])->name('update');

    // Destroy
    Route::delete('/delete/{id}', [ProductController::class, 'destroy'])->name('destroy');
});

// Transactions
Route::prefix('/transaction')->middleware('auth')->name('transaction.')->group(function () {
    // Index
    Route::get('/', [TransactionController::class, 'index'])->name('index');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
