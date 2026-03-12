<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SiteSectionController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\DistributorController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Public Routes - For Frontend (React)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/sections', [SiteSectionController::class, 'index']);
Route::get('/sections/{key}', [SiteSectionController::class, 'showByKey']);

Route::get('/media', [MediaController::class, 'index']);

Route::get('/distributors', [DistributorController::class, 'index']);

// Auth Routes (Public)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Protected Admin Routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Categories
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Products
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Site Sections
    Route::post('/sections', [SiteSectionController::class, 'store']);
    Route::put('/sections/{id}', [SiteSectionController::class, 'update']);
    Route::delete('/sections/{id}', [SiteSectionController::class, 'destroy']);

    // Media - File Upload
    Route::post('/media/upload', [MediaController::class, 'upload']);
    Route::post('/media/delete-file', [MediaController::class, 'deleteFile']);
    Route::post('/media', [MediaController::class, 'store']);
    Route::put('/media/{id}', [MediaController::class, 'update']);
    Route::delete('/media/{id}', [MediaController::class, 'destroy']);

    // Distributors
    Route::post('/distributors', [DistributorController::class, 'store']);
    Route::put('/distributors/{id}', [DistributorController::class, 'update']);
    Route::delete('/distributors/{id}', [DistributorController::class, 'destroy']);
});
