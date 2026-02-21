<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Database;

try {
    $db = Database::getConnection();
    echo "Connected to database successfully.\n";

    // 1. Create Admins Table
    $db->exec("CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");
    echo "Admins table created.\n";

    // 2. Create Categories Table
    $db->exec("CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        parent_id VARCHAR(50) NULL,
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
    ) ENGINE=InnoDB");
    echo "Categories table created.\n";

    // 2. Create Vehicles Table (Simplified for Make/Model/Year)
    $db->exec("CREATE TABLE IF NOT EXISTS vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        trim VARCHAR(50) NULL,
        UNIQUE KEY(make, model, year, trim)
    ) ENGINE=InnoDB");
    echo "Vehicles table created.\n";

    // 3. Create Products Table
    $db->exec("CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2) NULL,
        brand VARCHAR(100) NOT NULL,
        category_id VARCHAR(50) NOT NULL,
        image VARCHAR(255),
        images JSON,
        part_number VARCHAR(100),
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews_count INT DEFAULT 0,
        in_stock BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FULLTEXT idx_search (name, part_number)
    ) ENGINE=InnoDB");
    echo "Products table created.\n";

    // 4. Create Product-Vehicle Compatibility Table
    $db->exec("CREATE TABLE IF NOT EXISTS product_vehicles (
        product_id VARCHAR(50) NOT NULL,
        vehicle_id INT NOT NULL,
        PRIMARY KEY(product_id, vehicle_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
    ) ENGINE=InnoDB");
    echo "Product-Vehicles table created.\n";

    // 5. Create Users Table (Customers)
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");
    echo "Users table created.\n";

    // 6. Create User Addresses Table
    $db->exec("CREATE TABLE IF NOT EXISTS user_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) DEFAULT 'shipping',
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB");
    echo "User Addresses table created.\n";

    // 7. Create Orders Table
    $db->exec("CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        user_id INT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending_payment',
        shipping_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NULL,
        stripe_payment_intent_id VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB");
    echo "Orders table created.\n";

    // 8. Create Order Items Table
    $db->exec("CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        quantity INT NOT NULL,
        price_at_purchase DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB");
    echo "Order Items table created.\n";

    // Seeding Admin
    $adminPassword = password_hash('password123', PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT IGNORE INTO admins (email, password_hash) VALUES (?, ?)");
    $stmt->execute(['admin@autostyle.com', $adminPassword]);
    echo "Admin seeded.\n";

    // Seeding Categories
    // Removed mock categories for production/physical store use cases.

    // Seeding Vehicles
    $stmt = $db->prepare("INSERT IGNORE INTO vehicles (make, model, year) VALUES (?, ?, ?)");
    $vehicles = [
        ['Toyota', 'Yaris', 2020],
        ['Toyota', 'Corolla', 2021],
        ['Honda', 'Civic', 2019],
        ['VW', 'Golf', 2018],
        ['Nissan', 'Qashqai', 2022]
    ];
    foreach ($vehicles as $veh) {
        $stmt->execute($veh);
    }
    echo "Vehicles seeded.\n";

    // Seeding Products
    // Removed mock products for production/physical store use cases.

    echo "Migration and seeding completed successfully.\n";

} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
