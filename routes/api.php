<?php

use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\CctvController;
use App\Http\Controllers\Admin\GrafikController;
use App\Http\Controllers\Admin\HistoryController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\PolsekController;
use App\Http\Controllers\Admin\PreferenceController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SosController;
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

    Route::prefix('cctv')->group(function () {
        Route::get('/', [CctvController::class, 'getData']);
        Route::post('/', [CctvController::class, 'storeCctv']);
        Route::put('/', [CctvController::class, 'updateCctv']);
        Route::delete('/', [CctvController::class, 'deleteCctv']);
    });

    Route::prefix('berita')->group(function () {
        Route::get('/', [BeritaController::class, 'getData']);
        Route::post('/', [BeritaController::class, 'storeBerita']);
        Route::post('/update', [BeritaController::class, 'updateBerita']);
        Route::delete('/', [BeritaController::class, 'deleteBerita']);
    });

    Route::prefix('report')->group(function () {
        Route::get('/confirm', [ReportController::class, 'getDataConfirmReport']);
        Route::post('/confirm', [ReportController::class, 'confirmReport']);
        Route::post('/reject', [ReportController::class, 'rejectReport']);
    });


    Route::prefix('grafik')->group(function () {
        Route::post('/tahun', [GrafikController::class, 'filterTahun']);
        Route::post('/range', [GrafikController::class, 'filterRange']);
    });


    Route::prefix('history')->group(function () {
        Route::get('/', [HistoryController::class, 'getData']);
    });

    // for mobile
    Route::post('/register', [UserController::class, 'registerUser']);
    Route::post('/login', [UserController::class, 'loginUser']);

    Route::get('/berita', [BeritaController::class, 'getData']);

    Route::post('/reportuser', [ReportController::class, 'getReportUser']);
    Route::post('/report/add', [ReportController::class, 'insertReport']);

    Route::get('/polsek', [PolsekController::class, 'getData']);
    Route::get('/kategori/detail', [KategoriController::class, 'getAllDetailKategori']);
    Route::get('/kategori', [KategoriController::class, 'getAllKategori']);

    Route::get('/laporan', [HistoryController::class, 'getAllLaporanFinished']);
    Route::post('/laporan/import', [HistoryController::class, 'importLaporan']);

    Route::post('/preference', [PreferenceController::class, 'getData']);
    Route::post('/preference/update', [PreferenceController::class, 'updateData']);

    Route::post('/sos', [SosController::class, 'sendSos']);

    Route::prefix('profile')->group(function () {
        Route::post('update', [UserController::class, 'updateProfile']);
    });

    Route::post('/radar', [ReportController::class, 'getRadar']);
    Route::get('/sos', [SosController::class, 'getData']);
});
