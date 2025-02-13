<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('laporan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('detail_kategori_id')->constrained('detail_kategori')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('polsek_id')->constrained('polsek')->onUpdate('cascade')->onDelete('cascade');
            $table->text('keterangan');
            $table->string('bukti_gambar')->nullable();
            $table->enum('status', ['menunggu', 'disetujui', 'ditolak']);
            $table->string('lokasi');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan');
    }
};
