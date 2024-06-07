<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'nama' => 'Mphstar',
            'email' => 'mphstar@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'nohp' => '0895393933040'
        ]);
    }
}
