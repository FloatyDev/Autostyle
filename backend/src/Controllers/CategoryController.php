<?php

namespace App\Controllers;

use App\Database;
use PDO;

class CategoryController
{

    public function index()
    {
        try {
            $db = Database::getConnection();

            // Get root categories (no parent) and their children
            // For now, the schema is flat, so we just return all
            $stmt = $db->query("SELECT id, name, slug, description, parent_id FROM categories ORDER BY name ASC");
            $categories = $stmt->fetchAll();

            header('Content-Type: application/json');
            echo json_encode([
                "status" => "success",
                "data" => $categories
            ]);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Failed to fetch categories"
            ]);
        }
    }
}
