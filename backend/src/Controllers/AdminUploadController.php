<?php

namespace App\Controllers;

class AdminUploadController
{
    public function store()
    {
        // Ensure request is POST and contains a file named 'image'
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method Not Allowed']);
            return;
        }

        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'No image file uploaded or an error occurred during upload']);
            return;
        }

        $file = $_FILES['image'];

        // Validate MIME type
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowedMimeTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, and WEBP are allowed.']);
            return;
        }

        // Validate size (e.g. max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(['error' => 'File size exceeds 5MB limit.']);
            return;
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('prod_img_') . '.' . $extension;

        // Path should be relative to where the script is executed, mapping to the backend public folder
        // The container serves /var/www/html/public as the root for images if configured directly, 
        // but since this is an API framework, let's store it in public/images/products
        $uploadDir = __DIR__ . '/../../public/images/products/';

        // Ensure directory exists
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $destination = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            // Return public URL
            // Ensure this matches the Docker/Nginx static file routing. 
            // In Vite/React development, we might proxy /images, or /backend/public/images depending on setup.
            // Let's assume /images maps to backend/public/images
            $publicUrl = '/images/products/' . $filename;

            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'url' => $publicUrl
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to move uploaded file.']);
        }
    }
}
