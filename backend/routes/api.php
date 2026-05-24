<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\StaffController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->prefix('/auth')->group(function () {
    Route::post('/login', 'login');
});

// Public customer shop — no login required
Route::controller(ShopController::class)->prefix('/shop')->group(function () {
    Route::get('/loadShopCategories', 'loadShopCategories');
    Route::get('/loadShopProducts', 'loadShopProducts');
    Route::post('/storeOrder', 'storeOrder');
    Route::get('/trackOrder', 'trackOrder');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(AuthController::class)->prefix('/auth')->group(function () {
        Route::get('/me', 'me');
        Route::post('/logout', 'logout');
    });

    Route::controller(DashboardController::class)->prefix('/dashboard')->group(function () {
        Route::get('/getStats', 'getStats');
    });

    Route::controller(CategoryController::class)->prefix('/category')->group(function () {
        Route::get('/loadCategories', 'loadCategories');
        Route::get('/getCategory/{categoryId}', 'getCategory');
        Route::post('/storeCategory', 'storeCategory');
        Route::put('/updateCategory/{category}', 'updateCategory');
        Route::put('/destroyCategory/{category}', 'destroyCategory');
    });

    Route::controller(ProductController::class)->prefix('/product')->group(function () {
        Route::get('/loadProducts', 'loadProducts');
        Route::get('/loadLowStockProducts', 'loadLowStockProducts');
        Route::post('/storeProduct', 'storeProduct');
        Route::post('/updateProduct/{product}', 'updateProduct');
        Route::put('/destroyProduct/{product}', 'destroyProduct');
    });

    Route::controller(SaleController::class)->prefix('/sale')->group(function () {
        Route::get('/loadSales', 'loadSales');
        Route::post('/storeSale', 'storeSale');
        Route::put('/destroySale/{sale}', 'destroySale');
    });

    Route::controller(OrderController::class)->prefix('/order')->group(function () {
        Route::get('/loadOrders', 'loadOrders');
        Route::get('/getOrder/{order}', 'getOrder');
        Route::put('/updateOrderStatus/{order}', 'updateOrderStatus');
    });

    Route::controller(StaffController::class)->prefix('/staff')->group(function () {
        Route::get('/loadStaff', 'loadStaff');
        Route::post('/storeStaff', 'storeStaff');
        Route::put('/updateStaff/{staff}', 'updateStaff');
        Route::put('/destroyStaff/{staff}', 'destroyStaff');
    });
});
