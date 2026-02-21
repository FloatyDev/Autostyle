<?php

use PHPUnit\Framework\TestCase;

class OrderTest extends TestCase
{
    private $baseUrl = 'http://localhost/api';
    private $db;
    private $jwtSecret;

    protected function setUp(): void
    {
        $this->db = \App\Database::getConnection();
        $this->jwtSecret = getenv('JWT_SECRET_CUSTOMER') ?: 'my_customer_autostyle_key_456_7890';
    }

    private function makePostRequest($endpoint, $payload, $headers = [])
    {
        $url = $this->baseUrl . $endpoint;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

        $curlHeaders = ['Content-Type: application/json'];
        foreach ($headers as $key => $value) {
            $curlHeaders[] = "$key: $value";
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $curlHeaders);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'code' => $httpCode,
            'body' => json_decode($response, true)
        ];
    }

    public function testGuestCheckout()
    {
        $stmt = $this->db->query("SELECT id, price FROM products LIMIT 1");
        $product = $stmt->fetch();
        $this->assertNotEmpty($product, "Setup error: No products found.");

        $productId = $product['id'];
        $productPrice = (float) $product['price'];

        $payload = [
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'shipping_address' => '123 Fake St',
            'city' => 'Anytown',
            'postal_code' => '12345',
            'country' => 'USA',
            'phone' => '555-1234',
            'cart' => [
                [
                    'product_id' => $productId,
                    'quantity' => 2
                ]
            ]
        ];

        $res = $this->makePostRequest('/orders/checkout', $payload);

        $this->assertEquals(200, $res['code']);

        $data = $res['body'];
        $this->assertTrue($data['success']);

        $expectedTotal = $productPrice * 2;
        $this->assertEquals($expectedTotal, $data['total_amount']);
        $this->assertEquals('pending_payment', $data['status']);

        $stmt = $this->db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$data['order_id']]);
        $order = $stmt->fetch();

        $this->assertNotEmpty($order);
        $this->assertEquals('John Doe', $order['customer_name']);
        $this->assertNull($order['user_id']);
        $this->assertEquals($expectedTotal, (float) $order['total_amount']);
    }

    public function testAuthenticatedCheckout()
    {
        $stmt = $this->db->query("SELECT id, price FROM products LIMIT 1");
        $product = $stmt->fetch();
        $productId = $product['id'];

        $stmt = $this->db->prepare("INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)");
        $stmt->execute(['auth_' . time() . '@example.com', 'hash', 'Auth', 'User']);
        $userId = $this->db->lastInsertId();

        $payload = [
            'sub' => $userId,
            'email' => 'auth@example.com',
            'role' => 'customer',
            'iat' => time(),
            'exp' => time() + 3600
        ];
        $token = \Firebase\JWT\JWT::encode($payload, $this->jwtSecret, 'HS256');

        $checkoutPayload = [
            'customer_name' => 'Auth User',
            'customer_email' => 'auth@example.com',
            'shipping_address' => '456 Auth St',
            'city' => 'Authtown',
            'postal_code' => '67890',
            'country' => 'UK',
            'cart' => [
                [
                    'product_id' => $productId,
                    'quantity' => 1
                ]
            ]
        ];

        $res = $this->makePostRequest('/orders/checkout', $checkoutPayload, [
            'Authorization' => "Bearer {$token}"
        ]);

        $this->assertEquals(200, $res['code'], "Error: " . print_r($res['body'], true));

        $data = $res['body'];
        $this->assertTrue($data['success']);

        $stmt = $this->db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$data['order_id']]);
        $order = $stmt->fetch();

        $this->assertNotEmpty($order);
        $this->assertEquals($userId, $order['user_id']);
    }

    public function testCheckoutPreventsPriceManipulation()
    {
        $stmt = $this->db->query("SELECT id, price FROM products LIMIT 1");
        $product = $stmt->fetch();
        $productId = $product['id'];
        $productPrice = (float) $product['price'];

        $payload = [
            'customer_name' => 'hacker',
            'customer_email' => 'hacker@example.com',
            'shipping_address' => '123',
            'city' => '123',
            'postal_code' => '123',
            'country' => '123',
            'cart' => [
                [
                    'product_id' => $productId,
                    'quantity' => 1,
                    'price' => 0.01
                ]
            ]
        ];

        $res = $this->makePostRequest('/orders/checkout', $payload);

        $this->assertEquals(200, $res['code']);

        $data = $res['body'];
        $this->assertTrue($data['success']);

        $this->assertEquals($productPrice, $data['total_amount']);
    }
}
