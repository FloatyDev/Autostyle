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
        $db = App\Database::getConnection();
        $catId = $db->query("SELECT category_id FROM products LIMIT 1")->fetchColumn();
        if (!$catId)
            $this->markTestSkipped('No products found in DB');

        $res = $this->makeRequest('/products', ['category' => $catId]);
        $this->assertEquals(200, $res['code']);
        // If there are products in this category, let's just make sure they match
        // Because of recursive search, the product category might be a child. 
        // For simplicity we just check that we got results since we know this category has a product.
        $this->assertGreaterThan(0, $res['body']['count']);
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
        $db = App\Database::getConnection();
        $prodName = $db->query("SELECT name FROM products LIMIT 1")->fetchColumn();
        if (!$prodName)
            $this->markTestSkipped('No products found in DB');

        // take first word
        $term = explode(' ', $prodName)[0];

        $res = $this->makeRequest('/products', ['q' => $term]);
        $this->assertEquals(200, $res['code']);
        $this->assertGreaterThan(0, $res['body']['count']);
    }

    public function testGetProductsByPartNumberExactMatch()
    {
        $db = App\Database::getConnection();
        $partNumber = $db->query("SELECT part_number FROM products LIMIT 1")->fetchColumn();
        if (!$partNumber)
            $this->markTestSkipped('No products found in DB');

        $res = $this->makeRequest('/products', ['q' => $partNumber]);
        $this->assertEquals(200, $res['code']);
        $this->assertGreaterThan(0, $res['body']['count']);
        // We might get more than 1 if part_number isn't unique, but first item should match or contain it
        $found = false;
        foreach ($res['body']['data'] as $p) {
            if ($p['part_number'] === $partNumber)
                $found = true;
        }
        $this->assertTrue($found);
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
        $db = App\Database::getConnection();
        $totalProds = $db->query("SELECT count(*) FROM products")->fetchColumn();
        if ($totalProds < 1)
            $this->markTestSkipped('No products found in DB');

        $limit = min(2, $totalProds);

        $res = $this->makeRequest('/products', ['limit' => $limit]);
        $this->assertEquals($limit, $res['body']['count']);
        $this->assertCount($limit, $res['body']['data']);
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
