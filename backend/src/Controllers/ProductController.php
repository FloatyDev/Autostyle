<?php

namespace App\Controllers;

use App\Database;
use PDO;

class ProductController
{

    public function index()
    {
        try {
            $db = Database::getConnection();

            // Base query with search via FULLTEXT if 'q' is provided
            $query = "SELECT p.*, c.name as category_name 
                      FROM products p
                      LEFT JOIN categories c ON p.category_id = c.id";

            $params = [];
            $whereConditions = [];
            $joinVehicles = false;

            // 1. Full-Text Search or Exact Part Number Match
            if (isset($_GET['q']) && !empty($_GET['q'])) {
                $q = trim($_GET['q']);

                // If the search query looks like a specific part number (contains hyphens or is specifically a SKU)
                // Use a direct LIKE condition for better precision, otherwise use FULLTEXT
                if (strpos($q, '-') !== false || preg_match('/^[A-Z0-9\-]+$/i', $q)) {
                    $whereConditions[] = "(p.part_number LIKE :q_exact OR p.name LIKE :q_like)";
                    $params[':q_exact'] = $q;
                    $params[':q_like'] = "%{$q}%";
                } else {
                    $whereConditions[] = "MATCH(p.name, p.part_number) AGAINST(:q IN BOOLEAN MODE)";
                    $params[':q'] = $q . '*'; // Wildcard suffix for partial matching
                }
            }

            // 2. Category Filter (Recursive)
            if (isset($_GET['category']) && $_GET['category'] !== 'all-categories') {
                $categoryId = (int) $_GET['category'];

                // Fetch all categories to determine children
                $stmtCats = $db->query("SELECT id, parent_id FROM categories");
                $allCats = $stmtCats->fetchAll(PDO::FETCH_ASSOC);

                $childIds = [$categoryId];
                $toProcess = [$categoryId];

                while (!empty($toProcess)) {
                    $currentId = array_pop($toProcess);
                    foreach ($allCats as $cat) {
                        if ($cat['parent_id'] == $currentId && !in_array($cat['id'], $childIds)) {
                            $childIds[] = $cat['id'];
                            $toProcess[] = $cat['id'];
                        }
                    }
                }

                $catPlaceholders = [];
                foreach ($childIds as $index => $cid) {
                    $key = ":cat_$index";
                    $catPlaceholders[] = $key;
                    $params[$key] = $cid;
                }
                $whereConditions[] = "p.category_id IN (" . implode(',', $catPlaceholders) . ")";
            }

            // 3. Brand Filter
            if (isset($_GET['brands']) && !empty($_GET['brands'])) {
                $brands = explode(',', $_GET['brands']);
                $brandPlaceholders = [];
                foreach ($brands as $index => $brand) {
                    $key = ":brand_$index";
                    $brandPlaceholders[] = $key;
                    $params[$key] = $brand;
                }
                $whereConditions[] = "p.brand IN (" . implode(',', $brandPlaceholders) . ")";
            }

            // 4. Price Filter
            if (isset($_GET['min_price']) && is_numeric($_GET['min_price'])) {
                $whereConditions[] = "p.price >= :min_price";
                $params[':min_price'] = $_GET['min_price'];
            }
            if (isset($_GET['max_price']) && is_numeric($_GET['max_price'])) {
                $whereConditions[] = "p.price <= :max_price";
                $params[':max_price'] = $_GET['max_price'];
            }

            // 5. Vehicle Compatibility Filter (Make, Model, Year)
            // If any vehicle param is set, we need to join the product_vehicles table
            if (isset($_GET['make']) || isset($_GET['model']) || isset($_GET['year'])) {
                $joinVehicles = true;
                $query .= " JOIN product_vehicles pv ON p.id = pv.product_id
                            JOIN vehicles v ON pv.vehicle_id = v.id";

                if (isset($_GET['make'])) {
                    $whereConditions[] = "v.make = :make";
                    $params[':make'] = $_GET['make'];
                }
                if (isset($_GET['model'])) {
                    $whereConditions[] = "v.model = :model";
                    $params[':model'] = $_GET['model'];
                }
                if (isset($_GET['year'])) {
                    $whereConditions[] = "v.year = :year";
                    $params[':year'] = $_GET['year'];
                }
            }

            // Construct final query
            if (!empty($whereConditions)) {
                $query .= " WHERE " . implode(" AND ", $whereConditions);
            }

            // Ensure distinct if joined with vehicles to prevent duplicates
            if ($joinVehicles) {
                $query = str_replace("SELECT p.*", "SELECT DISTINCT p.*", $query);
            }

            $query .= " ORDER BY p.created_at DESC";

            // Pagination (Optional but good practice)
            $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 50;
            $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
            $offset = ($page - 1) * $limit;

            $query .= " LIMIT $limit OFFSET $offset";

            // Execute
            $stmt = $db->prepare($query);
            foreach ($params as $key => &$val) {
                // Determine PDO param type
                $paramType = is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR;
                $stmt->bindValue($key, $val, $paramType);
            }

            $stmt->execute();
            $products = $stmt->fetchAll();

            header('Content-Type: application/json');
            echo json_encode([
                "status" => "success",
                "count" => count($products),
                "data" => $products
            ]);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Failed to fetch products: " . $e->getMessage()
            ]);
        }
    }
}
