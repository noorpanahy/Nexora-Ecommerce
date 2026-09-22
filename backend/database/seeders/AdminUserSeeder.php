<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // This checks if the email exists first, preventing the duplicate error
        User::firstOrCreate(
            ['email' => 'admin@ecommerce.test'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin12345'),
                'role' => 'ADMIN',
            ]
        );
    }
}
