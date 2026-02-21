<?php

namespace App\Controllers;

use App\Database;
use PDO;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class OrderController
{
    private $db;
    private $jwtSecret;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->jwtSecret = getenv('JWT_SECRET_CUSTOMER') ?: 'my_customer_autostyle_key_456_7890';
    }

    public function checkout()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        // Attempt to extract user_id from optional JWT Token
        $userId = null;
        $headers = function_exists('apache_request_headers') ? apache_request_headers() : [];
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
        }
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            try {
                $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
                if (isset($decoded->role) && $decoded->role === 'customer') {
                    $userId = $decoded->sub;
                }
            } catch (Exception $e) {
                // Invalid tokens for guests are safely ignored or they log in again.
                // We proceed as guest if the token is invalid here. Or we could throw depending on strictness.
            }
        }

        // Validate input
        if (
            empty($data['customer_name']) || empty($data['customer_email']) || empty($data['shipping_address']) ||
            empty($data['city']) || empty($data['postal_code']) || empty($data['country']) || empty($data['cart'])
        ) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields or empty cart']);
            return;
        }

        $cart = $data['cart'];
        if (!is_array($cart) || count($cart) === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Cart is empty']);
            return;
        }

        try {
            $this->db->beginTransaction();

            $totalAmount = 0;
            $orderItems = [];

            foreach ($cart as $item) {
                if (empty($item['product_id']) || empty($item['quantity'])) {
                    throw new Exception("Invalid cart item format");
                }

                $stmt = $this->db->prepare("SELECT price FROM products WHERE id = ?");
                $stmt->execute([$item['product_id']]);
                $product = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$product) {
                    throw new Exception("Product not found: " . $item['product_id']);
                }

                $priceAtPurchase = (float) $product['price'];
                $quantity = (int) $item['quantity'];

                $totalAmount += $priceAtPurchase * $quantity;

                $orderItems[] = [
                    'product_id' => $item['product_id'],
                    'quantity' => $quantity,
                    'price_at_purchase' => $priceAtPurchase
                ];
            }

            // Insert into orders
            $stmt = $this->db->prepare("
                INSERT INTO orders (customer_name, customer_email, user_id, total_amount, status, shipping_address, city, postal_code, country, phone)
                VALUES (?, ?, ?, ?, 'pending_payment', ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $data['customer_name'],
                $data['customer_email'],
                $userId, // Null if guest
                $totalAmount,
                $data['shipping_address'],
                $data['city'],
                $data['postal_code'],
                $data['country'],
                $data['phone'] ?? null
            ]);

            $orderId = $this->db->lastInsertId();

            // Insert into order_items
            $stmtOrderItem = $this->db->prepare("
                INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                VALUES (?, ?, ?, ?)
            ");

            foreach ($orderItems as $orderItem) {
                $stmtOrderItem->execute([
                    $orderId,
                    $orderItem['product_id'],
                    $orderItem['quantity'],
                    $orderItem['price_at_purchase']
                ]);
            }

            $this->db->commit();

            echo json_encode([
                'success' => true,
                'order_id' => (int) $orderId,
                'total_amount' => $totalAmount,
                'status' => 'pending_payment',
                'message' => 'Order created successfully. Ready for payment processing.'
            ]);

        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
