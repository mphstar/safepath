<?php

use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\PolsekController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->group(function () {
    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'getData']);
        Route::post('/', [UserController::class, 'storeUser']);
        Route::put('/', [UserController::class, 'updateUser']);
        Route::delete('/', [UserController::class, 'deleteUser']);
    });
    Route::prefix('polsek')->group(function () {
        Route::get('/', [PolsekController::class, 'getData']);
        Route::post('/', [PolsekController::class, 'storePolsek']);
        Route::put('/', [PolsekController::class, 'updatePolsek']);
        Route::delete('/', [PolsekController::class, 'deletePolsek']);
    });
    Route::prefix('kategori')->group(function () {
        Route::prefix('kejahatan')->group(function () {
            Route::get('/', [KategoriController::class, 'getKategoriKejahatan']);
            Route::post('/', [KategoriController::class, 'storeKategoriKejahatan']);
            Route::put('/', [KategoriController::class, 'updateKategoriKejahatan']);
            Route::delete('/', [KategoriController::class, 'deleteKategoriKejahatan']);
        });
        Route::prefix('kecelakaan')->group(function () {
            Route::get('/', [KategoriController::class, 'getKategoriKecelakaan']);
            Route::post('/', [KategoriController::class, 'storeKategoriKecelakaan']);
            Route::put('/', [KategoriController::class, 'updateKategoriKecelakaan']);
            Route::delete('/', [KategoriController::class, 'deleteKategoriKecelakaan']);
        });
    });

    Route::prefix('berita')->group(function () {
        Route::get('/', [BeritaController::class, 'getData']);
        Route::post('/', [BeritaController::class, 'storeBerita']);
        Route::post('/update', [BeritaController::class, 'updateBerita']);
        Route::delete('/', [BeritaController::class, 'deleteBerita']);
    });
});
