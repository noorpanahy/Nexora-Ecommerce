<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::pluck('id')->toArray();

        if (empty($categories)) {
            throw new \Exception(
                'No categories found. Run CategorySeeder before ProductSeeder.'
            );
        }

        $products = [
            ['name' => 'Wireless Headphones', 'description' => 'Premium wireless headphones.', 'price' => 89.99, 'discount_price' => 69.99, 'sku' => 'WH-001', 'stock' => 25],
            ['name' => 'Smart Watch Pro', 'description' => 'Modern smartwatch with fitness tracking.', 'price' => 129.99, 'discount_price' => 99.99, 'sku' => 'SW-002', 'stock' => 18],
            ['name' => 'Premium Backpack', 'description' => 'Durable everyday backpack.', 'price' => 59.99, 'discount_price' => 44.99, 'sku' => 'BP-003', 'stock' => 30],
            ['name' => 'Running Sneakers', 'description' => 'Lightweight running sneakers.', 'price' => 79.99, 'discount_price' => 64.99, 'sku' => 'RS-004', 'stock' => 22],
            ['name' => 'Mechanical Keyboard', 'description' => 'RGB mechanical keyboard.', 'price' => 109.99, 'discount_price' => 89.99, 'sku' => 'MK-005', 'stock' => 15],
            ['name' => 'Wireless Mouse', 'description' => 'Ergonomic wireless mouse.', 'price' => 39.99, 'discount_price' => 29.99, 'sku' => 'WM-006', 'stock' => 40],
            ['name' => 'Smartphone Stand', 'description' => 'Adjustable aluminum smartphone stand.', 'price' => 24.99, 'discount_price' => null, 'sku' => 'SS-007', 'stock' => 50],
            ['name' => 'Minimalist Wallet', 'description' => 'Slim minimalist wallet.', 'price' => 29.99, 'discount_price' => 22.99, 'sku' => 'MW-008', 'stock' => 35],
            ['name' => 'Classic Sunglasses', 'description' => 'Stylish sunglasses with a classic frame.', 'price' => 49.99, 'discount_price' => 34.99, 'sku' => 'SG-009', 'stock' => 28],
            ['name' => 'Portable Bluetooth Speaker', 'description' => 'Compact Bluetooth speaker.', 'price' => 69.99, 'discount_price' => 54.99, 'sku' => 'BS-010', 'stock' => 20],
            ['name' => 'USB-C Fast Charger', 'description' => 'High-speed USB-C charger.', 'price' => 34.99, 'discount_price' => 27.99, 'sku' => 'FC-011', 'stock' => 45],
            ['name' => 'Laptop Sleeve', 'description' => 'Protective and stylish laptop sleeve.', 'price' => 39.99, 'discount_price' => null, 'sku' => 'LS-012', 'stock' => 32],
        ];

        foreach ($products as $index => $product) {
            $newProduct = Product::create([
                'category_id' => $categories[$index % count($categories)],
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'description' => $product['description'],
                'price' => $product['price'],
                'discount_price' => $product['discount_price'],
                'sku' => $product['sku'],
                'stock' => $product['stock'],
                'status' => true,
            ]);

            // Save relative link path matching your 'image' column descriptor
            $newProduct->images()->create([
                'image' => 'products/sample.jpg', // 👈 Points directly to your storage folder asset
                'is_primary' => true,
            ]);
        }
    }
}