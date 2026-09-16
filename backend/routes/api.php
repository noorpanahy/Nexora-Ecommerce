<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductImageController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Public Store Routes
|--------------------------------------------------------------------------
*/

Route::get('/categories', [
    CategoryController::class,
    'index'
]);

Route::get('/categories/{category}', [
    CategoryController::class,
    'show'
]);

Route::get('/products', [
    ProductController::class,
    'index'
]);

Route::get('/products/{product}', [
    ProductController::class,
    'show'
]);


/*
|--------------------------------------------------------------------------
| Customer Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::post('/logout', [
        AuthController::class,
        'logout'
    ]);

    Route::get('/user', [
        AuthController::class,
        'user'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Orders
    |--------------------------------------------------------------------------
    */

    Route::post('/orders', [
        OrderController::class,
        'store'
    ]);

    Route::get('/orders', [
        OrderController::class,
        'index'
    ]);

    Route::get('/orders/{order}', [
        OrderController::class,
        'show'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Cart
    |--------------------------------------------------------------------------
    */

    Route::get('/cart', [
        CartController::class,
        'index'
    ]);

    Route::post('/cart', [
        CartController::class,
        'store'
    ]);

    Route::put('/cart/items/{cartItem}', [
        CartController::class,
        'update'
    ]);

    Route::delete('/cart/items/{cartItem}', [
        CartController::class,
        'destroy'
    ]);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {


       Route::get(
        '/admin/dashboard',
        [DashboardController::class, 'index']
    );

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | Customers
    |--------------------------------------------------------------------------
    */

    Route::get('/admin/customers', [UserController::class, 'index']);

    Route::get('/admin/customers/{user}', [UserController::class, 'show']);

    Route::post('/admin/customers', [UserController::class, 'store']);

    Route::put('/admin/customers/{user}', [UserController::class, 'update']);

    Route::delete('/admin/customers/{user}', [UserController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */

    Route::post('/admin/products', [ProductController::class, 'store']);

    Route::put('/admin/products/{product}', [ProductController::class, 'update']);

    Route::delete('/admin/products/{product}', [ProductController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | Product Images
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/admin/products/{product}/images',
        [ProductImageController::class, 'store']
    );

    Route::delete(
        '/admin/product-images/{productImage}',
        [ProductImageController::class, 'destroy']
    );

    Route::put(
        '/admin/product-images/{productImage}/primary',
        [ProductImageController::class, 'setPrimary']
    );


    /*
    |--------------------------------------------------------------------------
    | Orders
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/orders',
        [OrderController::class, 'adminIndex']
    );

    Route::get(
        '/admin/orders/{order}',
        [OrderController::class, 'adminShow']
    );

    Route::put(
        '/admin/orders/{order}/status',
        [OrderController::class, 'updateStatus']
    );
});
