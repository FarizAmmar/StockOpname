<?php

use App\Http\Controllers\ApiController\ApiCategoryController;
use App\Http\Controllers\ApiController\ApiProductController;
use Illuminate\Support\Facades\Route;

// Api Resource
Route::apiResource('category', ApiCategoryController::class);
