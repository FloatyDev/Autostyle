<?php

use PHPUnit\Framework\TestCase;

class CustomerAuthTest extends TestCase
{
    private $baseUrl = 'http://localhost/api';
    private static $testEmail;
    private static $testPassword = 'password123';
    private static $token = '';

    public static function setUpBeforeClass(): void
    {
        self::$testEmail = 'testuser_' . time() . '@example.com';
    }

    private function makeRequest($endpoint, $method = 'GET', $data = null, $token = null)
    {
        $url = $this->baseUrl . $endpoint;
        $ch = curl_init($url);

        $headers = ['Content-Type: application/json'];
        if ($token) {
            $headers[] = 'Authorization: Bearer ' . $token;
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($data) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            }
        } elseif ($method === 'PUT') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
            if ($data) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            }
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 400 || !$response || !json_decode($response)) {
            var_dump([
                'url' => $url,
                'method' => $method,
                'payload' => $data,
                'httpCode' => $httpCode,
                'response' => $response
            ]);
        }

        return [
            'code' => $httpCode,
            'body' => json_decode($response, true)
        ];
    }

    public function testRegisterCustomer()
    {
        $payload = [
            'email' => self::$testEmail,
            'password' => self::$testPassword,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '1234567890'
        ];

        $res = $this->makeRequest('/auth/customer/register', 'POST', $payload);

        $this->assertEquals(200, $res['code']);
        $this->assertEquals('success', $res['body']['status']);
        $this->assertNotEmpty($res['body']['token']);

        // Save token for future tests
        self::$token = $res['body']['token'];
    }

    public function testRegisterDuplicateEmailReturns409()
    {
        $payload = [
            'email' => self::$testEmail, // already exists
            'password' => self::$testPassword,
            'first_name' => 'John',
            'last_name' => 'Doe'
        ];

        $res = $this->makeRequest('/auth/customer/register', 'POST', $payload);
        $this->assertEquals(409, $res['code']);
    }

    public function testLoginCustomer()
    {
        $payload = [
            'email' => self::$testEmail,
            'password' => self::$testPassword
        ];

        $res = $this->makeRequest('/auth/customer/login', 'POST', $payload);

        $this->assertEquals(200, $res['code']);
        $this->assertEquals('success', $res['body']['status']);
        $this->assertNotEmpty($res['body']['token']);
        $this->assertEquals(self::$testEmail, $res['body']['user']['email']);
    }

    public function testLoginInvalidCredentialsReturns401()
    {
        $payload = [
            'email' => self::$testEmail,
            'password' => 'wrongpassword'
        ];

        $res = $this->makeRequest('/auth/customer/login', 'POST', $payload);
        $this->assertEquals(401, $res['code']);
    }

    public function testGetProfile()
    {
        $res = $this->makeRequest('/customer/profile', 'GET', null, self::$token);

        $this->assertEquals(200, $res['code']);
        $this->assertEquals('success', $res['body']['status']);
        $this->assertEquals(self::$testEmail, $res['body']['user']['email']);
        $this->assertEquals('John', $res['body']['user']['first_name']);
    }

    public function testGetProfileWithoutTokenReturns401()
    {
        $res = $this->makeRequest('/customer/profile', 'GET');
        $this->assertEquals(401, $res['code']);
    }

    public function testUpdateProfile()
    {
        $payload = [
            'first_name' => 'Johnny',
            'last_name' => 'Doeson',
            'phone' => '0987654321',
            'type' => 'shipping',
            'street' => '123 Test St',
            'city' => 'Test City',
            'postal_code' => '12345',
            'country' => 'Greece'
        ];

        $res = $this->makeRequest('/customer/profile', 'PUT', $payload, self::$token);

        $this->assertEquals(200, $res['code']);
        $this->assertEquals('Johnny', $res['body']['user']['first_name']);

        $this->assertNotEmpty($res['body']['addresses']);
        $address = $res['body']['addresses'][0];
        $this->assertEquals('123 Test St', $address['street']);
        $this->assertEquals('Test City', $address['city']);
    }
}
