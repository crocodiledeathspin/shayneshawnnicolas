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
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        $products = [
            ['category_id' => 1, 'product_name' => 'Fish Ball (10 pcs)', 'price' => 15.00, 'stock_qty' => 50, 'unit' => 'serving', 'reorder_level' => 10],
            ['category_id' => 1, 'product_name' => 'Kwek-Kwek (5 pcs)', 'price' => 20.00, 'stock_qty' => 30, 'unit' => 'serving', 'reorder_level' => 8],
            ['category_id' => 1, 'product_name' => 'Kikiam (5 pcs)', 'price' => 25.00, 'stock_qty' => 25, 'unit' => 'serving', 'reorder_level' => 8],
            ['category_id' => 2, 'product_name' => 'Mango Shake (16oz)', 'price' => 45.00, 'stock_qty' => 40, 'unit' => 'cup', 'reorder_level' => 10],
            ['category_id' => 2, 'product_name' => 'Chocolate Shake (16oz)', 'price' => 50.00, 'stock_qty' => 35, 'unit' => 'cup', 'reorder_level' => 10],
            ['category_id' => 2, 'product_name' => 'Buko Pandan Shake', 'price' => 55.00, 'stock_qty' => 20, 'unit' => 'cup', 'reorder_level' => 8],
            ['category_id' => 3, 'product_name' => 'Chippy Original', 'price' => 10.00, 'stock_qty' => 100, 'unit' => 'pack', 'reorder_level' => 20],
            ['category_id' => 3, 'product_name' => 'Nova Country Cheddar', 'price' => 15.00, 'stock_qty' => 80, 'unit' => 'pack', 'reorder_level' => 15],
            ['category_id' => 4, 'product_name' => 'Lucky Me Pancit Canton', 'price' => 15.00, 'stock_qty' => 60, 'unit' => 'pack', 'reorder_level' => 15],
            ['category_id' => 4, 'product_name' => 'Sinandomeng Rice 1kg', 'price' => 55.00, 'stock_qty' => 3, 'unit' => 'kg', 'reorder_level' => 5],
            ['category_id' => 5, 'product_name' => 'Coke Mismo', 'price' => 20.00, 'stock_qty' => 48, 'unit' => 'bottle', 'reorder_level' => 12],
            ['category_id' => 5, 'product_name' => 'Cobra Energy Drink', 'price' => 25.00, 'stock_qty' => 4, 'unit' => 'bottle', 'reorder_level' => 10],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
