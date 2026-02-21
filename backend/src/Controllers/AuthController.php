<?php

namespace App\Controllers;

use App\Database;
use Firebase\JWT\JWT;

class AuthController
{
    private $db;
    private $jwtSecret;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'my_super_secret_autostyle_key_123';
    }

    public function login()
    {
        // Must be POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method Not Allowed']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }

        $stmt = $this->db->prepare('SELECT * FROM admins WHERE email = ?');
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password_hash'])) {
            $issuedAt = time();
            $expirationTime = $issuedAt + 3600 * 24; // var_dump 24 hours
            $payload = [
                'iat' => $issuedAt,
                'exp' => $expirationTime,
                'sub' => $admin['id'],
                'email' => $admin['email']
            ];

            $token = JWT::encode($payload, $this->jwtSecret, 'HS256');

            echo json_encode([
                'message' => 'Login successful',
                'token' => $token,
                'admin' => [
                    'id' => $admin['id'],
                    'email' => $admin['email']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    }
}
