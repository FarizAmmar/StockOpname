<?php

use App\Http\Controllers\ApiController\ApiCategoryController;
use App\Http\Controllers\ApiController\ApiProductController;
use Illuminate\Support\Facades\Route;


Route::prefix('/api')->middleware('api')->name('api.')->group(function () {
    // API Product
    Route::prefix('/product')->name('product.')->group(function () {
        // Get all record 
        Route::get('/', [ApiProductController::class, 'index'])->name('get_data');
        // Get detail record
        Route::get('/{id}/detail', [ApiProductController::class, 'show'])->name('get_detail');
    });

    // API Category
    Route::prefix('/category')->name('category.')->group(function () {
        // Get all record
        Route::get('/', [ApiCategoryController::class, 'index'])->name('get_data');
    });
});
