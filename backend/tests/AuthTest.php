<?php

use PHPUnit\Framework\TestCase;

class AuthTest extends TestCase
{
    private $authUrl = 'http://localhost/api/auth/login';

    public function testValidLogin()
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
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $this->assertEquals(200, $httpCode);

        $data = json_decode($response, true);
        $this->assertArrayHasKey('token', $data);
        $this->assertEquals('Login successful', $data['message']);
        $this->assertEquals('admin@autostyle.com', $data['admin']['email']);
    }

    public function testInvalidLogin()
    {
        $payload = json_encode([
            'email' => 'admin@autostyle.com',
            'password' => 'wrongpassword'
        ]);

        $ch = curl_init($this->authUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $this->assertEquals(401, $httpCode);
        $data = json_decode($response, true);
        $this->assertArrayHasKey('error', $data);
    }
}
