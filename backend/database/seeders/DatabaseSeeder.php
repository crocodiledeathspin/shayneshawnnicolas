<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'full_name' => 'Rosa Mendoza',
            'username' => 'owner',
            'password' => 'owner123',
            'role' => 'owner',
        ]);

        User::create([
            'full_name' => 'Juan Dela Cruz',
            'username' => 'staff01',
            'password' => 'staff123',
            'role' => 'staff',
        ]);

        $categories = [
            ['category_name' => 'Street Food', 'description' => 'Fish balls, kikiam, kwek-kwek, etc.'],
            ['category_name' => 'Shakes', 'description' => 'Fruit shakes and milk teas'],
            ['category_name' => 'Snacks', 'description' => 'Chips, biscuits, candies'],
            ['category_name' => 'Groceries', 'description' => 'Rice, noodles, canned goods'],
            ['category_name' => 'Beverages', 'description' => 'Soft drinks, juices, water'],
            ['category_name' => 'Frozen Products', 'description' => 'Frozen siomai, hotdog, nuggets, ice candy, etc.'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        $products = [
            // Street Food (1)
            ['category_id' => 1, 'product_name' => 'Fish Ball (10 pcs)', 'description' => 'Classic street fish balls with sauce', 'price' => 15.00, 'stock_qty' => 50, 'unit' => 'serving', 'reorder_level' => 10],
            ['category_id' => 1, 'product_name' => 'Kwek-Kwek (5 pcs)', 'description' => 'Quail eggs in orange batter', 'price' => 20.00, 'stock_qty' => 30, 'unit' => 'serving', 'reorder_level' => 8],
            ['category_id' => 1, 'product_name' => 'Kikiam (5 pcs)', 'description' => 'Fried kikiam sticks', 'price' => 25.00, 'stock_qty' => 25, 'unit' => 'serving', 'reorder_level' => 8],
            ['category_id' => 1, 'product_name' => 'Siomai (6 pcs cooked)', 'description' => 'Steamed pork siomai ready to serve', 'price' => 35.00, 'stock_qty' => 20, 'unit' => 'serving', 'reorder_level' => 8],
            // Shakes (2)
            ['category_id' => 2, 'product_name' => 'Mango Shake (16oz)', 'description' => 'Fresh mango shake', 'price' => 45.00, 'stock_qty' => 40, 'unit' => 'cup', 'reorder_level' => 10],
            ['category_id' => 2, 'product_name' => 'Chocolate Shake (16oz)', 'description' => 'Rich chocolate shake', 'price' => 50.00, 'stock_qty' => 35, 'unit' => 'cup', 'reorder_level' => 10],
            ['category_id' => 2, 'product_name' => 'Buko Pandan Shake', 'description' => 'Coconut pandan flavor', 'price' => 55.00, 'stock_qty' => 20, 'unit' => 'cup', 'reorder_level' => 8],
            // Snacks (3)
            ['category_id' => 3, 'product_name' => 'Chippy Original', 'description' => 'Garlic corn snack', 'price' => 10.00, 'stock_qty' => 100, 'unit' => 'pack', 'reorder_level' => 20],
            ['category_id' => 3, 'product_name' => 'Nova Country Cheddar', 'description' => 'Cheese flavored chips', 'price' => 15.00, 'stock_qty' => 80, 'unit' => 'pack', 'reorder_level' => 15],
            // Groceries (4)
            ['category_id' => 4, 'product_name' => 'Lucky Me Pancit Canton', 'description' => 'Instant pancit canton', 'price' => 15.00, 'stock_qty' => 60, 'unit' => 'pack', 'reorder_level' => 15],
            ['category_id' => 4, 'product_name' => 'Sinandomeng Rice 1kg', 'description' => 'Premium white rice', 'price' => 55.00, 'stock_qty' => 3, 'unit' => 'kg', 'reorder_level' => 5],
            // Beverages (5)
            ['category_id' => 5, 'product_name' => 'Coke Mismo', 'description' => '300ml Coca-Cola', 'price' => 20.00, 'stock_qty' => 48, 'unit' => 'bottle', 'reorder_level' => 12],
            ['category_id' => 5, 'product_name' => 'Cobra Energy Drink', 'description' => 'Energy drink bottle', 'price' => 25.00, 'stock_qty' => 4, 'unit' => 'bottle', 'reorder_level' => 10],
            // Frozen Products (6)
            ['category_id' => 6, 'product_name' => 'Frozen Pork Siomai (30 pcs)', 'description' => 'Pack of 30 pcs frozen siomai — steam or fry at home', 'price' => 120.00, 'stock_qty' => 25, 'unit' => 'pack', 'reorder_level' => 8],
            ['category_id' => 6, 'product_name' => 'Frozen Chicken Siomai (30 pcs)', 'description' => 'Pack of 30 pcs chicken siomai', 'price' => 115.00, 'stock_qty' => 22, 'unit' => 'pack', 'reorder_level' => 8],
            ['category_id' => 6, 'product_name' => 'Frozen Japanese Siomai (25 pcs)', 'description' => 'Premium japanese style siomai', 'price' => 135.00, 'stock_qty' => 18, 'unit' => 'pack', 'reorder_level' => 6],
            ['category_id' => 6, 'product_name' => 'Frozen Hotdog Jumbo (1kg)', 'description' => 'Tender jumbo hotdog for grilling or frying', 'price' => 95.00, 'stock_qty' => 20, 'unit' => 'pack', 'reorder_level' => 6],
            ['category_id' => 6, 'product_name' => 'Frozen Chicken Nuggets (500g)', 'description' => 'Breaded chicken nuggets', 'price' => 85.00, 'stock_qty' => 30, 'unit' => 'pack', 'reorder_level' => 10],
            ['category_id' => 6, 'product_name' => 'Frozen Fish Ball (40 pcs)', 'description' => 'Frozen fish balls for boiling or frying', 'price' => 65.00, 'stock_qty' => 35, 'unit' => 'pack', 'reorder_level' => 10],
            ['category_id' => 6, 'product_name' => 'Frozen Kikiam (20 pcs)', 'description' => 'Frozen kikiam rolls', 'price' => 75.00, 'stock_qty' => 28, 'unit' => 'pack', 'reorder_level' => 8],
            ['category_id' => 6, 'product_name' => 'Frozen Longganisa (12 pcs)', 'description' => 'Sweet pork longganisa', 'price' => 90.00, 'stock_qty' => 15, 'unit' => 'pack', 'reorder_level' => 5],
            ['category_id' => 6, 'product_name' => 'Frozen Ice Candy Assorted (10 pcs)', 'description' => 'Mango, orange, chocolate ice candy', 'price' => 50.00, 'stock_qty' => 40, 'unit' => 'pack', 'reorder_level' => 12],
            ['category_id' => 6, 'product_name' => 'Frozen Lumpia Shanghai (25 pcs)', 'description' => 'Pork shanghai lumpia ready to fry', 'price' => 110.00, 'stock_qty' => 20, 'unit' => 'pack', 'reorder_level' => 6],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
