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
        Schema::create('contact_preference', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_preference_id')->constrained('user_preference')->onUpdate('cascade')->onDelete('cascade');
            $table->string('nama');
            $table->string('email');
            $table->boolean('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_preference');
    }
};
