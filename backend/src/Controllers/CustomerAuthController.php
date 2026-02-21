<?php

namespace App\Controllers;

use App\Database;
use Firebase\JWT\JWT;

class CustomerAuthController
{
    private $db;
    private $jwtSecret;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->jwtSecret = getenv('JWT_SECRET_CUSTOMER') ?: 'my_customer_autostyle_key_456_7890';
    }

    public function register()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method Not Allowed']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $firstName = $input['first_name'] ?? '';
        $lastName = $input['last_name'] ?? '';
        $phone = $input['phone'] ?? null;

        if (empty($email) || empty($password) || empty($firstName) || empty($lastName)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email, password, first name, and last name are required']);
            return;
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        try {
            $stmt = $this->db->prepare('INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$email, $passwordHash, $firstName, $lastName, $phone]);
            $userId = $this->db->lastInsertId();

            $token = $this->generateToken($userId, $email);

            echo json_encode([
                'status' => 'success',
                'message' => 'Registration successful',
                'token' => $token,
                'user' => [
                    'id' => $userId,
                    'email' => $email,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'phone' => $phone
                ]
            ]);
        } catch (\PDOException $e) {
            if ($e->getCode() == 23000) {
                http_response_code(409);
                echo json_encode(['error' => 'Email already exists']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
            }
        }
    }

    public function login()
    {
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

        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $token = $this->generateToken($user['id'], $user['email']);

            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'phone' => $user['phone']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    }

    public function getProfile()
    {
        $userId = $_SERVER['CUSTOMER_USER_ID'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $stmt = $this->db->prepare('SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }

        // Get addresses
        $stmt = $this->db->prepare('SELECT id, type, street, city, postal_code, country, is_default FROM user_addresses WHERE user_id = ?');
        $stmt->execute([$userId]);
        $addresses = $stmt->fetchAll();

        echo json_encode([
            'status' => 'success',
            'user' => $user,
            'addresses' => $addresses
        ]);
    }

    public function updateProfile()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            http_response_code(405);
            echo json_encode(['error' => 'Method Not Allowed']);
            return;
        }

        $userId = $_SERVER['CUSTOMER_USER_ID'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $firstName = $input['first_name'] ?? null;
        $lastName = $input['last_name'] ?? null;
        $phone = $input['phone'] ?? null;

        if (!$firstName || !$lastName) {
            http_response_code(400);
            echo json_encode(['error' => 'First name and last name are required']);
            return;
        }

        $stmt = $this->db->prepare('UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?');
        $stmt->execute([$firstName, $lastName, $phone, $userId]);

        // Optional: Update or insert address
        if (isset($input['street']) && isset($input['city']) && isset($input['postal_code']) && isset($input['country'])) {
            // Check if address exists
            $stmt = $this->db->prepare('SELECT id FROM user_addresses WHERE user_id = ? AND type = ?');
            $type = $input['type'] ?? 'shipping';
            $stmt->execute([$userId, $type]);
            $address = $stmt->fetch();

            if ($address) {
                $stmt = $this->db->prepare('UPDATE user_addresses SET street = ?, city = ?, postal_code = ?, country = ? WHERE id = ?');
                $stmt->execute([$input['street'], $input['city'], $input['postal_code'], $input['country'], $address['id']]);
            } else {
                $stmt = $this->db->prepare('INSERT INTO user_addresses (user_id, type, street, city, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$userId, $type, $input['street'], $input['city'], $input['postal_code'], $input['country'], 1]);
            }
        }

        $this->getProfile(); // Return updated profile
    }

    private function generateToken($userId, $email)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600 * 24 * 30; // 30 days expiration
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'sub' => $userId,
            'email' => $email,
            'role' => 'customer'
        ];

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }
}
