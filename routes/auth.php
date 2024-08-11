<?php

use App\Http\Controllers\Auth\AuthenticatedController;
use Illuminate\Support\Facades\Route;

Route::prefix('/login')->middleware('guest')->name('login.')->group(function () {

    // Login View
    Route::get('/', [AuthenticatedController::class, 'login_view'])->name('index');

    // Login Store
    Route::post('/store', [AuthenticatedController::class, 'login_store'])->name('store');
});

// Logout
Route::get('/logout', [AuthenticatedController::class, 'logout'])->middleware('auth')->name('logout');
