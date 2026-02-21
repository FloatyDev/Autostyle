# Autostyle Database Schema Design

This document outlines the proposed database schema for the Autostyle eCommerce platform. The goal is to ensure high performance for complex filtering (by vehicle, category, brand, and price) while maintaining data integrity.

## Core Entities & Relationships

### 1. `categories`
Hierarchical category structure (e.g., Engine Parts -> Belts & Chains).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | PRIMARY KEY | Unique identifier (e.g., 'engine-parts') |
| `name` | VARCHAR(100) | NOT NULL | Display name |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly slug |
| `parent_id` | VARCHAR(50) | FOREIGN KEY | Self-referencing FK for subcategories |

**Indexes:** `idx_parent_id (parent_id)` for quick subcategory lookups.

### 2. `vehicles`
Stores the Make, Model, and Year hierarchy. To make filtering efficient, we store these individually but also maintain a unique constraint to avoid duplicates.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | AUTO_INCREMENT, PK | Internal ID |
| `make` | VARCHAR(50) | NOT NULL | e.g., 'Toyota' |
| `model` | VARCHAR(50) | NOT NULL | e.g., 'Yaris' |
| `year` | INT | NOT NULL | e.g., 2020 |
| `trim` | VARCHAR(50) | NULL | Optional specific trim level |

**Indexes:** 
- `idx_make_model_year (make, model, year)`: Crucial for the vehicle selector dropdowns. We need to quickly find all models for a make, and all years for a model.
- `UNIQUE KEY (make, model, year, trim)`: Ensure no overlapping vehicles.

### 3. `products`
The core catalog table. Contains intrinsic product data.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | PRIMARY KEY | SKU or custom ID |
| `name` | VARCHAR(255) | NOT NULL | Product title |
| `description` | TEXT | | Detailed HTML/Text |
| `price` | DECIMAL(10,2)| NOT NULL | Current selling price |
| `original_price`| DECIMAL(10,2)| NULL | For displaying discounts |
| `brand` | VARCHAR(100) | NOT NULL | Manufacturer (e.g., 'Bosch') |
| `category_id` | VARCHAR(50) | FOREIGN KEY | Links to `categories(id)` |
| `part_number` | VARCHAR(100) | | Manufacturer part number |
| `in_stock` | BOOLEAN | DEFAULT TRUE | Availability flag |

**Indexes:**
- `idx_category (category_id)`: For category page loads.
- `idx_brand (brand)`: For frontend brand filtering.
- `idx_price (price)`: For frontend price range sliders.
- *(Combination)* `idx_cat_brand_price (category_id, brand, price)`: High-performance composite index for the most common storefront queries.
- `FULLTEXT idx_search (name, part_number)`: Allows ultra-fast search functionality when a user queries by product title or specific manufacturer part number.

### 4. `product_vehicles` (Many-to-Many Pivot)
Since one spare part (like a generic oil filter or battery) can fit multiple vehicles, and one vehicle needs many parts, this is a many-to-many relationship.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `product_id` | VARCHAR(50) | FK to `products` | The spare part |
| `vehicle_id` | INT | FK to `vehicles` | The vehicle it fits |

**Constraints:** `PRIMARY KEY (product_id, vehicle_id)`
**Indexes:**
- `idx_vehicle_product (vehicle_id, product_id)`: Super fast lookup when a user selects their car in "My Garage" and navigates the site.

## Query Efficiency Analysis

**Scenario 1: User selects *Toyota Yaris 2020*, goes to *Brakes* category, and filters by *Brembo* brand.**

This is handled seamlessly via joins:
```sql
SELECT p.* 
FROM products p
JOIN product_vehicles pv ON p.id = pv.product_id
JOIN vehicles v ON pv.vehicle_id = v.id
WHERE v.make = 'Toyota' 
  AND v.model = 'Yaris' 
  AND v.year = 2020
  AND p.category_id = 'brakes'
  AND p.brand = 'Brembo';
```
*Why it's fast:* The database will hit the unique index on `vehicles`, jump to the `product_vehicles` pivot using `vehicle_id`, and filter by `idx_category_brand` on the `products` table.

## Future Considerations
- **Variants/Attributes:** If we need products with sizes or colors (less common in auto parts, but possible), we might need a `product_attributes` table later.

Does this schema structure and indexing strategy meet your expectations, or should we track additional data points (like weight, dimensions, or compatibility notes per vehicle)?
