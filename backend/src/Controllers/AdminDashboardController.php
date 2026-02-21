<?php

namespace App\Controllers;

use App\Database;

class AdminDashboardController
{
    public function stats()
    {
        try {
            $db = Database::getConnection();

            // Total Products
            $stmt = $db->query('SELECT COUNT(*) as count FROM products');
            $totalProducts = $stmt->fetch()['count'];

            // Total Categories
            $stmt = $db->query('SELECT COUNT(*) as count FROM categories');
            $totalCategories = $stmt->fetch()['count'];

            // Out of Stock Products
            $stmt = $db->query('SELECT COUNT(*) as count FROM products WHERE in_stock = 0');
            $outOfStock = $stmt->fetch()['count'];

            header('Content-Type: application/json');
            echo json_encode([
                "status" => "success",
                "data" => [
                    "total_products" => (int) $totalProducts,
                    "total_categories" => (int) $totalCategories,
                    "out_of_stock" => (int) $outOfStock
                ]
            ]);

        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Failed to fetch stats: " . $e->getMessage()
            ]);
        }
    }
}
