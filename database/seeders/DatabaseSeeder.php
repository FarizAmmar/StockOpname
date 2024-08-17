<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Superadmin',
            'email' => 'test@gmail.com',
            'password' => 'superadmin',
        ]);

        Category::create([
            'slug' => 'packaging',
            'name' => 'Packaging',
        ]);

        Category::create([
            'slug' => 'prasmanan',
            'name' => 'Prasmanan',
        ]);
    }
}
