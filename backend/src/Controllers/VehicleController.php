<?php

namespace App\Controllers;

use App\Database;
use PDO;

class VehicleController
{

    public function makes()
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->query("SELECT DISTINCT make FROM vehicles ORDER BY make ASC");
            $makes = $stmt->fetchAll(PDO::FETCH_COLUMN);

            header('Content-Type: application/json');
            echo json_encode(["status" => "success", "data" => $makes]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to fetch makes"]);
        }
    }

    public function models($make)
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT DISTINCT model FROM vehicles WHERE make = ? ORDER BY model ASC");
            $stmt->execute([$make]);
            $models = $stmt->fetchAll(PDO::FETCH_COLUMN);

            header('Content-Type: application/json');
            echo json_encode(["status" => "success", "data" => $models]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to fetch models"]);
        }
    }

    public function years($make, $model)
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT DISTINCT year FROM vehicles WHERE make = ? AND model = ? ORDER BY year DESC");
            $stmt->execute([$make, $model]);
            $years = $stmt->fetchAll(PDO::FETCH_COLUMN);

            header('Content-Type: application/json');
            echo json_encode(["status" => "success", "data" => $years]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to fetch years"]);
        }
    }
}
