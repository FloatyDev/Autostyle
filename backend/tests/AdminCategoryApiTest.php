<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use App\Database;

class AdminCategoryApiTest extends TestCase
{
    private $db;
    private $token;

    protected function setUp(): void
    {
        $this->db = Database::getConnection();

        // We will not delete all categories. We'll only delete our test-specific ones.
        $this->db->exec("DELETE FROM categories WHERE id LIKE 'test-cat-%'");

        // Ensure admin exists and get token
        $this->db->exec("DELETE FROM admins WHERE email = 'test_admin_cat@autostyle.com'");
        $passwordHash = password_hash('password123', PASSWORD_DEFAULT);
        $this->db->exec("INSERT INTO admins (email, password_hash) VALUES ('test_admin_cat@autostyle.com', '$passwordHash')");

        // Login to get token
        $ch = curl_init('http://autostyle-backend/api/auth/login');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'email' => 'test_admin_cat@autostyle.com',
            'password' => 'password123'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->token = $data['token'] ?? null;

        $this->assertNotNull($this->token, "Failed to get auth token for tests");
    }

    protected function tearDown(): void
    {
        $this->db->exec("DELETE FROM categories WHERE id LIKE 'test-cat-%'");
        $this->db->exec("DELETE FROM admins WHERE email = 'test_admin_cat@autostyle.com'");
    }

    public function testCreateCategory()
    {
        $ch = curl_init('http://autostyle-backend/api/admin/categories');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'id' => 'test-cat-create-1',
            'name' => 'Test Category',
            'slug' => 'test-category',
            'description' => 'A test category'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->token
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $this->assertEquals(201, $httpCode);
        $data = json_decode($response, true);
        $this->assertArrayHasKey('id', $data);

        // Verify in DB
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$data['id']]);
        $category = $stmt->fetch();

        $this->assertNotEmpty($category);
        $this->assertEquals('Test Category', $category['name']);
    }

    public function testDeleteCategory()
    {
        // First create a category directly in DB
        $id = 'test-cat-del-1';
        $stmt = $this->db->prepare("INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)");
        $stmt->execute([$id, 'ToDelete', 'to-delete']);

        // Now delete via API
        $ch = curl_init('http://autostyle-backend/api/admin/categories/' . $id);
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
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        $category = $stmt->fetch();

        $this->assertEmpty($category);
    }
}
