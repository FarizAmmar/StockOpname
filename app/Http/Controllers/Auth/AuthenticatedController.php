<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthenticatedController extends Controller
{
    // Login View
    public function login_view()
    {
        return Inertia::render('Auth/Login');
    }

    // Login store
    public function login_store(LoginRequest $request)
    {
        try {
            $request->validated();

            $request->authenticate();
        } catch (\Throwable $th) {
            
            return back()->withErrors($th->getMessage());
        }
    }

    // Logout
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
