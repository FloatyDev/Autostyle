# Autostyle Backend API Testing Report

This document contains a comprehensive report on the unit testing and validation of the newly developed PHP API backend for Autostyle.

## Overview
A total of **21 PHPUnit tests** were created and executed to validate the core functionality, filtering precision, and edge cases of the backend product and taxonomy APIs. The tests ensure that the frontend React application will reliably interact with the backend logic.

**Result**: PASS (21/21 Tests Passed, 70 Assertions)

## Test Coverage Breakdown

### 1. Categories API (`/api/categories`)
- **Base fetching**: Validates that fetching categories returns a `200 OK` code along with an array of category results.

### 2. Vehicles API (`/api/vehicles/*`)
- **Makes fetching**: Validates that all distinct vehicle makes are retrieved.
- **Models fetching**: Validates that fetching models by make (e.g. `Toyota`) accurately returns the respective models (e.g. `Yaris`).
- **Models invalid fallback**: Validates that unknown or invalid makes safely return an empty array without crashing the endpoint.
- **Years fetching**: Validates that fetching years by make and model accurately yields the compatible years.

### 3. Products API (`/api/products`)
The Products API is the most complex endpoint, involving several dynamic SQL filters. Coverage includes:
- **Base listing**: Ensures a raw product fetch returns products.
- **Category filtering**: Confirms that filtering by a specific category slug effectively restricts the result set to that category only.
- **Invalid Category filtering**: Confirms that unknown categories safely return `0` results.
- **Search filtering (Query `q`)**: 
  - Validates general substring fulltext matches for words like "Brake".
  - **Edge Case Addressed**: Tested exact part numbers (e.g., `BR-7890`). This revealed an issue with MySQL's `FULLTEXT` index ignoring hyphenated strings as words. The API was refactored to use standard `LIKE` conditions when the search query resembles a SKU/Part Number, resolving the bug.
- **Vehicle compatibility**: Evaluates the `product_vehicles` table join. Asserts fetching products compatible with a specific Make, Model, and Year combination. Tests invalid/unsupported vehicles to ensure `0` results.
- **Brand filtering**: 
  - Validates fetching products from a single brand.
  - Validates fetching products from multiple brands formatted as a comma-separated string (e.g., `Bosch,Brembo`) using `IN()` clauses.
- **Price filtering**: 
  - Validates `min_price` and `max_price` limits.
  - Validates range boundaries combined (e.g., products between `10` and `45`).
- **Combined complex filtering**: Applies category, brand array, and price ranges simultaneously to ensure the `WHERE` string builder doesn't encounter syntax errors and properly conjoins operations with `AND`.
- **Pagination**: Validates that the `limit` query correctly subsets the payload count to exactly that limit integer.

### 4. Security & Robustness Edge Cases
- **Invalid parameter types**: Supplied string text inside numeric filter fields (e.g., `min_price = "invalid"`). The API gracefully casts / ignores these rather than resulting in `500` fatal errors.
- **SQL Injection resilience**: Included stray quote characters and boolean operators (`' OR '1'='1`) into the search inputs. The PDO parameterized prepared statements successfully escaped the risk, returning a safe `200 OK` (with zero results).

## Conclusion
The backend API is robust, performant, and correctly filters nested vehicle and product requirements. The frontend application will safely depend on these endpoints for the interactive UI. The backend is now stable and ready for the administration authentication and CRUD layer construction.
