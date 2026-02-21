<?php

namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthMiddleware
{
    private $jwtSecret;

    public function __construct()
    {
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'my_super_secret_autostyle_key_123';
    }

    public function handle()
    {
        $headers = function_exists('apache_request_headers') ? apache_request_headers() : [];
        // Support normal $_SERVER header fallback
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
        }

        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized: Token missing']);
            exit;
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            // Optionally, pass admin user data to request via globals or attributes (bramus doesn't support req attributes easily)
            $_SERVER['ADMIN_USER_ID'] = $decoded->sub;
            $_SERVER['ADMIN_EMAIL'] = $decoded->email;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized: Invalid token', 'message' => $e->getMessage()]);
            exit;
        }
    }
}
