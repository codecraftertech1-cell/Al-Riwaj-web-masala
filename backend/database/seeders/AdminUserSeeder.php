<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Delete existing admin users first
        User::where('role', 'admin')->delete();
        
        // Create default admin user
        User::create([
            'name' => 'M.asifsiddqu@419902',
            'email' => null,
            'password' => Hash::make('atta2882'),
            'role' => 'admin',
            'is_active' => true,
        ]);
        
        echo "Admin user created: M.asifsiddqu@419902 / atta2882\n";
    }
}
