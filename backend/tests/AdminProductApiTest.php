<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use App\Database;

class AdminProductApiTest extends TestCase
{
    private $db;
    private $token;

    protected function setUp(): void
    {
        $this->db = Database::getConnection();

        // Clean up products and categories for tests
        $this->db->exec("DELETE FROM products WHERE id LIKE 'test-prod-%'");
        $this->db->exec("DELETE FROM categories WHERE id LIKE 'test-cat-prod-%'");

        // Ensure admin exists and get token
        $this->db->exec("DELETE FROM admins WHERE email = 'test_admin_prod@autostyle.com'");
        $passwordHash = password_hash('password123', PASSWORD_DEFAULT);
        $this->db->exec("INSERT INTO admins (email, password_hash) VALUES ('test_admin_prod@autostyle.com', '$passwordHash')");

        // Login to get token
        $ch = curl_init('http://autostyle-backend/api/auth/login');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'email' => 'test_admin_prod@autostyle.com',
            'password' => 'password123'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->token = $data['token'] ?? null;

        $this->assertNotNull($this->token, "Failed to get auth token for tests");

        // Create a dummy category for product insertion
        $this->db->exec("INSERT INTO categories (id, name, slug) VALUES ('test-cat-prod-1', 'Test Category', 'test-cat')");
    }

    protected function tearDown(): void
    {
        $this->db->exec("DELETE FROM products WHERE id LIKE 'test-prod-%'");
        $this->db->exec("DELETE FROM categories WHERE id LIKE 'test-cat-prod-%'");
        $this->db->exec("DELETE FROM admins WHERE email = 'test_admin_prod@autostyle.com'");
    }

    public function testCreateProduct()
    {
        $ch = curl_init('http://autostyle-backend/api/admin/products');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'id' => 'test-prod-create-1',
            'name' => 'Test Product',
            'brand' => 'Test Brand',
            'category_id' => 'test-cat-prod-1',
            'price' => 19.99,
            'description' => 'A test product'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->token
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $this->assertEquals(201, $httpCode, "Expected 201 Created. Response: $response");
        $data = json_decode($response, true);
        $this->assertArrayHasKey('id', $data);

        // Verify in DB
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$data['id']]);
        $product = $stmt->fetch();

        $this->assertNotEmpty($product);
        $this->assertEquals('Test Product', $product['name']);
        $this->assertEquals(19.99, $product['price']);
    }

    public function testDeleteProduct()
    {
        // First create a product directly in DB
        $id = 'test-prod-del-1';
        $stmt = $this->db->prepare("INSERT INTO products (id, name, brand, category_id, price) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$id, 'ToDelete', 'TestBrand', 'test-cat-prod-1', 10.0]);

        // Now delete via API
        $ch = curl_init('http://autostyle-backend/api/admin/products/' . $id);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $this->assertEquals(200, $httpCode, "Expected 200 OK. Response: $response");

        // Verify it's gone
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        $this->assertEmpty($product);
    }
}
