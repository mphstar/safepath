<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\BooksController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'index']);
    });
});
