<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\BookingBarController;
use App\Http\Controllers\GalleryController;

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

Route::get('/', function () {
    return Inertia::render('Home');
});

// CSRF cookie route for token refresh
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json([
        'message' => 'CSRF cookie set',
        'token' => csrf_token()
    ])->withCookie(cookie('XSRF-TOKEN', csrf_token(), 120, '/', null, false, true));
});

// Debug route to test CSRF token
Route::get('/debug/csrf', function () {
    return response()->json([
        'current_token' => csrf_token(),
        'session_id' => session()->getId(),
        'timestamp' => now()->toISOString()
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard/home', function () {
    return Inertia::render('Dashboard/Home');
})->middleware(['auth', 'verified'])->name('dashboard.home');

Route::get('/dashboard/home/banner', function () {
    return Inertia::render('Dashboard/Banner');
})->middleware(['auth', 'verified'])->name('dashboard.banner');

Route::get('/dashboard/home/booking-bar', function () {
    return Inertia::render('Dashboard/BookingBar');
})->middleware(['auth', 'verified'])->name('dashboard.booking-bar');

Route::get('/dashboard/home/gallery', function () {
    return Inertia::render('Dashboard/Gallery');
})->middleware(['auth', 'verified'])->name('dashboard.gallery');

Route::middleware('auth')->group(function () {
    Route::get('/profile', function () {
        return Inertia::render('Dashboard/Profile/Edit');
    })->name('profile.edit');

            // Hero API routes (using web middleware for proper session handling)
            Route::get('/api/hero/active', [HeroController::class, 'getActive']);
            Route::put('/api/hero/update', [HeroController::class, 'update']);
            Route::post('/api/hero/update', [HeroController::class, 'update']); // Allow POST for file uploads
            Route::post('/api/hero/rename-background', [HeroController::class, 'renameBackgroundImage']); // Rename background image
            Route::get('/api/hero', [HeroController::class, 'index']);
            Route::delete('/api/hero/{id}', [HeroController::class, 'destroy']);

            // Booking Bar API routes
            Route::get('/api/booking-bar/active', [BookingBarController::class, 'getActive']);
            Route::put('/api/booking-bar/update', [BookingBarController::class, 'update']);

            // Gallery API routes
            Route::get('/api/gallery/active', [GalleryController::class, 'getActive']);
            Route::put('/api/gallery/update', [GalleryController::class, 'update']);
            Route::post('/api/gallery/upload-image', [GalleryController::class, 'uploadImage']);
            Route::delete('/api/gallery/delete-image', [GalleryController::class, 'deleteImage']);
            Route::put('/api/gallery/rename-image', [GalleryController::class, 'renameImage']);
});

// Public routes (no auth required)
Route::get('/api/hero/active', [HeroController::class, 'getActive']);
Route::get('/api/booking-bar/active', [BookingBarController::class, 'getActive']);
Route::get('/api/gallery/active', [GalleryController::class, 'getActive']);


require __DIR__.'/auth.php';
