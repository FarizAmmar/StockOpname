<?php

// Dashboard

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Dashboard
Route::get('/', function () {
    return Inertia::render('Home/Dashboard');
})->middleware('auth')->name('dashboard');

require __DIR__ . '/auth.php';
