<?php

use App\Http\Controllers\Product\CategoryController;
use Illuminate\Support\Facades\Route;

// Api Resource
Route::apiResource('category', CategoryController::class);
