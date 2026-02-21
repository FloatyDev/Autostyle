<?php

use PHPUnit\Framework\TestCase;

class ApiEndpointsTest extends TestCase
{

    private $baseUrl = 'http://localhost/api';

    private function makeRequest($endpoint, $params = [])
    {
        $url = $this->baseUrl . $endpoint;
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'code' => $httpCode,
            'body' => json_decode($response, true)
        ];
    }

    // --- Category Tests ---
    public function testGetCategoriesReturns200AndData()
    {
        $res = $this->makeRequest('/categories');
        $this->assertEquals(200, $res['code']);
        $this->assertEquals('success', $res['body']['status']);
        $this->assertNotEmpty($res['body']['data']);
    }

    // --- Vehicle Tests ---
    public function testGetVehiclesMakesReturns200AndData()
    {
        $res = $this->makeRequest('/vehicles/makes');
        $this->assertEquals(200, $res['code']);
        $this->assertEquals('success', $res['body']['status']);
        $this->assertContains('Toyota', $res['body']['data']);
    }

    public function testGetVehiclesModelsForToyota()
    {
        $res = $this->makeRequest('/vehicles/models/Toyota');
        $this->assertEquals(200, $res['code']);
        $this->assertEquals('success', $res['body']['status']);
        $this->assertContains('Yaris', $res['body']['data']);
    }

    public function testGetVehiclesModelsForInvalidMakeReturnsEmpty()
    {
        $res = $this->makeRequest('/vehicles/models/Ferrari');
        $this->assertEquals(200, $res['code']);
        $this->assertEmpty($res['body']['data']);
    }

    public function testGetVehiclesYearsForToyotaYaris()
    {
        $res = $this->makeRequest('/vehicles/years/Toyota/Yaris');
        $this->assertEquals(200, $res['code']);
        $this->assertEquals('success', $res['body']['status']);
        $this->assertContains(2020, $res['body']['data']);
    }

    // --- Product Tests ---

    // 1. Basic listing
    public function testGetProductsReturns200()
    {
        $res = $this->makeRequest('/products');
        $this->assertEquals(200, $res['code']);
        $this->assertEquals('success', $res['body']['status']);
        $this->assertGreaterThan(0, $res['body']['count']);
    }

    // 2. Category Filter
    public function testGetProductsByCategory()
    {
        $res = $this->makeRequest('/products', ['category' => 'brakes']);
        $this->assertEquals(200, $res['code']);
        $this->assertGreaterThan(0, count($res['body']['data']));
        foreach ($res['body']['data'] as $product) {
            $this->assertEquals('brakes', $product['category_id']);
        }
    }

    public function testGetProductsByInvalidCategory()
    {
        $res = $this->makeRequest('/products', ['category' => 'invalid-cat']);
        $this->assertEquals(200, $res['code']);
        $this->assertEquals(0, $res['body']['count']);
    }

    // 3. Search Filter
    public function testGetProductsBySearchTerm()
    {
        $res = $this->makeRequest('/products', ['q' => 'Brake']);
        $this->assertEquals(200, $res['code']);
        $this->assertGreaterThan(0, $res['body']['count']);
    }

    public function testGetProductsByPartNumberExactMatch()
    {
        $res = $this->makeRequest('/products', ['q' => 'BR-7890']);
        $this->assertEquals(200, $res['code']);
        $this->assertEquals(1, $res['body']['count']);
        $this->assertEquals('BR-7890', $res['body']['data'][0]['part_number']);
    }

    // 4. Vehicle Compatibility Filter
    public function testGetProductsCompatibleWithToyotaYaris2020()
    {
        $res = $this->makeRequest('/products', ['make' => 'Toyota', 'model' => 'Yaris', 'year' => 2020]);
        $this->assertEquals(200, $res['code']);
        // From seed data, product 1 and 2 are mostly compatible with everything for demo, but let's just ensure no error
        $this->assertEquals('success', $res['body']['status']);
    }

    public function testGetProductsCompatibleWithNonExistentCar()
    {
        $res = $this->makeRequest('/products', ['make' => 'FakeMake', 'model' => 'FakeModel', 'year' => 1990]);
        $this->assertEquals(200, $res['code']);
        $this->assertEquals(0, $res['body']['count']);
    }

    // 5. Brand Filter
    public function testGetProductsByBrand()
    {
        $res = $this->makeRequest('/products', ['brands' => 'Bosch']);
        $this->assertEquals(200, $res['code']);
        foreach ($res['body']['data'] as $p) {
            $this->assertEquals('Bosch', $p['brand']);
        }
    }

    public function testGetProductsByMultipleBrands()
    {
        $res = $this->makeRequest('/products', ['brands' => 'Bosch,Brembo']);
        $this->assertEquals(200, $res['code']);
        foreach ($res['body']['data'] as $p) {
            $this->assertTrue(in_array($p['brand'], ['Bosch', 'Brembo']));
        }
    }

    // 6. Price Filter
    public function testGetProductsByMinPrice()
    {
        $res = $this->makeRequest('/products', ['min_price' => 50]);
        $this->assertEquals(200, $res['code']);
        foreach ($res['body']['data'] as $p) {
            $this->assertGreaterThanOrEqual(50, $p['price']);
        }
    }

    public function testGetProductsByMaxPrice()
    {
        $res = $this->makeRequest('/products', ['max_price' => 20]);
        $this->assertEquals(200, $res['code']);
        foreach ($res['body']['data'] as $p) {
            $this->assertLessThanOrEqual(20, $p['price']);
        }
    }

    public function testGetProductsByPriceRange()
    {
        $res = $this->makeRequest('/products', ['min_price' => 10, 'max_price' => 45]);
        $this->assertEquals(200, $res['code']);
        foreach ($res['body']['data'] as $p) {
            $this->assertGreaterThanOrEqual(10, $p['price']);
            $this->assertLessThanOrEqual(45, $p['price']);
        }
    }

    // 7. Combined Filters
    public function testGetProductsCombinedFilters()
    {
        $res = $this->makeRequest('/products', [
            'category' => 'brakes',
            'brands' => 'Brembo',
            'min_price' => 10,
            'max_price' => 100
        ]);
        $this->assertEquals(200, $res['code']);
        foreach ($res['body']['data'] as $p) {
            $this->assertEquals('brakes', $p['category_id']);
            $this->assertEquals('Brembo', $p['brand']);
            $this->assertGreaterThanOrEqual(10, $p['price']);
            $this->assertLessThanOrEqual(100, $p['price']);
        }
    }

    // 8. Pagination 
    public function testGetProductsPaginationLimit()
    {
        $res = $this->makeRequest('/products', ['limit' => 2]);
        $this->assertEquals(2, $res['body']['count']);
        $this->assertCount(2, $res['body']['data']);
    }

    // 9. SQL Injection / Invalid Params robustness (Subtle checks)
    public function testGetProductsInvalidPriceTypeIsIgnored()
    {
        $res = $this->makeRequest('/products', ['min_price' => 'invalid-abc']);
        // The API should handle this gracefully (ignore the filter) and return 200
        $this->assertEquals(200, $res['code']);
    }

    public function testGetProductsQuotesInSearchAreHandled()
    {
        $res = $this->makeRequest('/products', ['q' => "Brake' OR '1'='1"]);
        $this->assertEquals(200, $res['code']);
    }
}
