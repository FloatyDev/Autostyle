<?php

use PHPUnit\Framework\TestCase;

class AdminEndpointsTest extends TestCase
{
    private $adminUrl = 'http://localhost/api/admin/categories';
    private $authUrl = 'http://localhost/api/auth/login';

    private function getToken()
    {
        $payload = json_encode([
            'email' => 'admin@autostyle.com',
            'password' => 'password123'
        ]);

        $ch = curl_init($this->authUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        return $data['token'] ?? null;
    }

    public function testUnauthenticatedAccessRejected()
    {
        $ch = curl_init($this->adminUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['name' => 'Test', 'slug' => 'test']));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $this->assertEquals(401, $httpCode);
    }

    public function testAuthenticatedAccessAllowed()
    {
        $token = $this->getToken();
        $this->assertNotNull($token, 'Failed to obtain JWT token for testing');

        // Create a test category
        $payload = json_encode([
            'id' => 'test-cat-123',
            'name' => 'Test Category',
            'slug' => 'test-category'
        ]);

        $ch = curl_init($this->adminUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            "Authorization: Bearer $token"
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $this->assertEquals(201, $httpCode, "Expected 201 Created but got $httpCode - Response: $response");

        // Clean up the created category
        $chDelete = curl_init($this->adminUrl . '/test-cat-123');
        curl_setopt($chDelete, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($chDelete, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($chDelete, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer $token"
        ]);
        curl_exec($chDelete);
        curl_close($chDelete);
    }
}
