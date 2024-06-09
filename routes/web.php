<?php

use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HistoryController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\PolsekController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\BooksController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [BooksController::class, 'index']);

Route::prefix('admin')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);

    // Master Data
    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'index']);
    });
    Route::prefix('polsek')->group(function () {
        Route::get('/', [PolsekController::class, 'index']);
    });
    Route::prefix('kategori')->group(function () {
        Route::get('/kejahatan', [KategoriController::class, 'indexKejahatan']);
        Route::get('/kecelakaan', [KategoriController::class, 'indexKecelakaan']);
    });

    // Service
    Route::prefix('confirm-report')->group(function () {
        Route::get('/', [ReportController::class, 'indexConfirmReport']);
    });

    Route::prefix('berita')->group(function () {
        Route::get('/', [BeritaController::class, 'index']);
    });

    // report
    Route::prefix('history')->group(function () {
        Route::get('/', [HistoryController::class, 'index']);
    });
});
