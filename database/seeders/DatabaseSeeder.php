<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Berita;
use App\Models\DetailKategori;
use App\Models\Kategori;
use App\Models\Laporan;
use App\Models\Polsek;
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

        Polsek::create([
            'id' => 1,
            'nama_kecamatan' => fake()->name(),
            'kontak' => fake()->unique()->safeEmail(),
            'penanggung_jawab' => fake()->name(),
        ]);
        Polsek::create([
            'id' => 2,
            'nama_kecamatan' => fake()->name(),
            'kontak' => fake()->unique()->safeEmail(),
            'penanggung_jawab' => fake()->name(),
        ]);
        Polsek::create([
            'id' => 3,
            'nama_kecamatan' => fake()->name(),
            'kontak' => fake()->unique()->safeEmail(),
            'penanggung_jawab' => fake()->name(),
        ]);
        Polsek::create([
            'id' => 4,
            'nama_kecamatan' => fake()->name(),
            'kontak' => fake()->unique()->safeEmail(),
            'penanggung_jawab' => fake()->name(),
        ]);
        Polsek::create([
            'id' => 5,
            'nama_kecamatan' => fake()->name(),
            'kontak' => fake()->unique()->safeEmail(),
            'penanggung_jawab' => fake()->name(),
        ]);

        Kategori::create([
            'id' => 1,
            'nama' => 'Kejahatan',
        ]);

        Kategori::create([
            'id' => 2,
            'nama' => 'Kecelakaan',
        ]);

        DetailKategori::create([
            'id' => 1,
            'kategori_id' => 1,
            'nama' => 'Drugs',
        ]);
        DetailKategori::create([
            'id' => 2,
            'kategori_id' => 1,
            'nama' => 'Maling',
        ]);
        DetailKategori::create([
            'id' => 3,
            'kategori_id' => 1,
            'nama' => 'Pelecehan',
        ]);
        DetailKategori::create([
            'id' => 4,
            'kategori_id' => 1,
            'nama' => 'Tawuran',
        ]);
        DetailKategori::create([
            'id' => 5,
            'kategori_id' => 2,
            'nama' => 'Kecelakaan Ringan',
        ]);
        DetailKategori::create([
            'id' => 6,
            'kategori_id' => 2,
            'nama' => 'Kecelakaan Sedang',
        ]);
        DetailKategori::create([
            'id' => 7,
            'kategori_id' => 2,
            'nama' => 'Kecelakaan Parah',
        ]);

        Laporan::factory(50)->create();

        Berita::factory(50)->create();
    }
}
