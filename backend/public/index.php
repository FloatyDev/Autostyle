<?php
require __DIR__ . '/../vendor/autoload.php';

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Simple router setup
$router = new \Bramus\Router\Router();

// Define controllers namespace
$router->setNamespace('\App\Controllers');

$router->get('/', function () {
    echo json_encode(["message" => "Autostyle API is running"]);
});

// Auth Route (Admin)
$router->post('/api/auth/login', 'AuthController@login');

// Customer Auth Routes
$router->post('/api/auth/customer/register', 'CustomerAuthController@register');
$router->post('/api/auth/customer/login', 'CustomerAuthController@login');

// Protected Customer Routes
$router->before('GET|POST|PUT|DELETE', '/api/customer/.*', function () {
    $middleware = new \App\Middleware\CustomerAuthMiddleware();
    $middleware->handle();
});

$router->mount('/api/customer', function () use ($router) {
    $router->get('/profile', 'CustomerAuthController@getProfile');
    $router->put('/profile', 'CustomerAuthController@updateProfile');
});

// Protected Admin Routes
$router->before('GET|POST|PUT|DELETE', '/api/admin/.*', function () {
    $middleware = new \App\Middleware\AuthMiddleware();
    $middleware->handle();
});

$router->mount('/api/admin', function () use ($router) {
    // Admin Categories
    $router->post('/categories', 'AdminCategoryController@store');
    $router->put('/categories/([^/]+)', 'AdminCategoryController@update');
    $router->delete('/categories/([^/]+)', 'AdminCategoryController@destroy');

    // Admin Products
    $router->post('/products', 'AdminProductController@store');
    $router->put('/products/([^/]+)', 'AdminProductController@update');
    $router->delete('/products/([^/]+)', 'AdminProductController@destroy');

    // Admin Image Upload
    $router->post('/upload', 'AdminUploadController@store');

    // Admin Dashboard Stats
    $router->get('/stats', 'AdminDashboardController@stats');
});

$router->mount('/api', function () use ($router) {
    // Categories
    $router->get('/categories', 'CategoryController@index');

    // Products
    $router->get('/products', 'ProductController@index');

    // Vehicles
    $router->get('/vehicles/makes', 'VehicleController@makes');
    $router->get('/vehicles/models/([^/]+)', 'VehicleController@models'); // Pass make as arg
    $router->get('/vehicles/years/([^/]+)/([^/]+)', 'VehicleController@years'); // Pass make, model
});

// Run it!
$router->run();
