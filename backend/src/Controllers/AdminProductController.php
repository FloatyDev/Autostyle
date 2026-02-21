<?php

namespace App\Controllers;

use App\Database;

class AdminProductController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function store()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $id = $input['id'] ?? uniqid('prod-');
        $name = $input['name'] ?? '';
        $description = $input['description'] ?? '';
        $price = $input['price'] ?? 0;
        $originalPrice = $input['original_price'] ?? null;
        $brand = $input['brand'] ?? '';
        $categoryId = $input['category_id'] ?? '';
        $image = $input['image'] ?? '';
        $images = isset($input['images']) ? json_encode($input['images']) : null;
        $partNumber = $input['part_number'] ?? '';
        $inStock = $input['in_stock'] ?? 1;

        if (empty($name) || empty($price) || empty($categoryId)) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, price, and category_id are required']);
            return;
        }

        try {
            $stmt = $this->db->prepare('INSERT INTO products (id, name, description, price, original_price, brand, category_id, image, images, part_number, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([$id, $name, $description, $price, $originalPrice, $brand, $categoryId, $image, $images, $partNumber, $inStock]);

            http_response_code(201);
            echo json_encode(['message' => 'Product created successfully', 'id' => $id]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create product', 'details' => $e->getMessage()]);
        }
    }

    public function update($id)
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $fields = [];
        $values = [];
        $allowedFields = ['name', 'description', 'price', 'original_price', 'brand', 'category_id', 'image', 'images', 'part_number', 'in_stock'];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $input)) {
                $fields[] = "$field = ?";
                $values[] = $field === 'images' && is_array($input[$field]) ? json_encode($input[$field]) : $input[$field];
            }
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }

        $values[] = $id;

        try {
            $sql = 'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?';
            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            echo json_encode(['message' => 'Product updated successfully']);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update product', 'details' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $stmt = $this->db->prepare('DELETE FROM products WHERE id = ?');
            $stmt->execute([$id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Product deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete product', 'details' => $e->getMessage()]);
        }
    }
}
