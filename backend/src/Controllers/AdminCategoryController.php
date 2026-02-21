<?php

namespace App\Controllers;

use App\Database;

class AdminCategoryController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function store()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $id = $input['id'] ?? uniqid('cat-');
        $name = $input['name'] ?? '';
        $slug = $input['slug'] ?? '';
        $description = $input['description'] ?? '';
        $parentId = $input['parent_id'] ?? null;

        if (empty($name) || empty($slug)) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and slug are required']);
            return;
        }

        try {
            $stmt = $this->db->prepare('INSERT INTO categories (id, name, slug, description, parent_id) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$id, $name, $slug, $description, $parentId]);

            http_response_code(201);
            echo json_encode(['message' => 'Category created successfully', 'id' => $id]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create category', 'details' => $e->getMessage()]);
        }
    }

    public function update($id)
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $name = $input['name'] ?? null;
        $slug = $input['slug'] ?? null;
        $description = $input['description'] ?? null;
        $parentId = $input['parent_id'] ?? null;

        if (!$name && !$slug && !$description && !$parentId) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }

        $fields = [];
        $values = [];

        if ($name !== null) {
            $fields[] = 'name = ?';
            $values[] = $name;
        }
        if ($slug !== null) {
            $fields[] = 'slug = ?';
            $values[] = $slug;
        }
        if ($description !== null) {
            $fields[] = 'description = ?';
            $values[] = $description;
        }
        if (array_key_exists('parent_id', $input)) {
            $fields[] = 'parent_id = ?';
            $values[] = $parentId;
        }

        $values[] = $id;

        try {
            $sql = 'UPDATE categories SET ' . implode(', ', $fields) . ' WHERE id = ?';
            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            echo json_encode(['message' => 'Category updated successfully']);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update category', 'details' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $stmt = $this->db->prepare('DELETE FROM categories WHERE id = ?');
            $stmt->execute([$id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Category deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Category not found']);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete category', 'details' => $e->getMessage()]);
        }
    }
}
