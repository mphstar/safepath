<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Laporan>
 */
class LaporanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "user_id" => 1,
            "detail_kategori_id" => fake()->numberBetween(1, 7),
            "polsek_id" => fake()->numberBetween(1, 5),
            "keterangan" => fake()->sentence(),
            "bukti_gambar" => "1717850084.jpg",
            "status" => fake()->randomElement(["menunggu", "disetujui", "ditolak"]),
            "lokasi" => fake()->longitude() . "," . fake()->latitude(),
        ];
    }
}
