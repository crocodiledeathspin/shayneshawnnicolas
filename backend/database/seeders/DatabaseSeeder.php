<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CustomerDebt;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $jojo = User::create([
            'full_name' => 'Jojo',
            'username' => 'jojo',
            'password' => 'jojo123',
            'role' => 'owner',
        ]);

        User::create([
            'full_name' => 'Rhanzel Joi',
            'username' => 'rhanzel',
            'password' => 'rhanzel123',
            'role' => 'owner',
        ]);

        $staff1 = User::create([
            'full_name' => 'Staff Employee 1',
            'username' => 'staff01',
            'password' => 'staff123',
            'role' => 'staff',
        ]);

        User::create([
            'full_name' => 'Staff Employee 2',
            'username' => 'staff02',
            'password' => 'staff123',
            'role' => 'staff',
        ]);

        $categories = [
            ['category_name' => 'Sari-Sari Essentials', 'description' => 'Rice, noodles, canned goods, daily groceries'],
            ['category_name' => 'Snack House', 'description' => 'Street food, chips, quick snacks (1 month snack house)'],
            ['category_name' => 'Beverages', 'description' => 'Soft drinks, juices, water'],
            ['category_name' => 'Frozen Products', 'description' => 'Frozen siomai, hotdog, nuggets, ice candy, etc.'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        $products = [
            // Sari-Sari Essentials (1)
            ['category_id' => 1, 'product_name' => 'Lucky Me Pancit Canton', 'description' => 'Instant pancit canton', 'price' => 15.00, 'stock_qty' => 60, 'unit' => 'pack', 'reorder_level' => 15],
            ['category_id' => 1, 'product_name' => 'Sinandomeng Rice 1kg', 'description' => 'Premium white rice', 'price' => 55.00, 'stock_qty' => 3, 'unit' => 'kg', 'reorder_level' => 5],
            ['category_id' => 1, 'product_name' => 'Argentina Corned Beef 150g', 'description' => 'Canned corned beef', 'price' => 42.00, 'stock_qty' => 24, 'unit' => 'can', 'reorder_level' => 8],
            // Snack House (2)
            ['category_id' => 2, 'product_name' => 'Fish Ball (10 pcs)', 'description' => 'Classic street fish balls with sauce', 'price' => 15.00, 'stock_qty' => 50, 'unit' => 'serving', 'reorder_level' => 10],
            ['category_id' => 2, 'product_name' => 'Kwek-Kwek (5 pcs)', 'description' => 'Quail eggs in orange batter', 'price' => 20.00, 'stock_qty' => 30, 'unit' => 'serving', 'reorder_level' => 8],
            ['category_id' => 2, 'product_name' => 'Siomai (6 pcs cooked)', 'description' => 'Steamed pork siomai ready to serve', 'price' => 35.00, 'stock_qty' => 20, 'unit' => 'serving', 'reorder_level' => 8],
            ['category_id' => 2, 'product_name' => 'Chippy Original', 'description' => 'Garlic corn snack', 'price' => 10.00, 'stock_qty' => 100, 'unit' => 'pack', 'reorder_level' => 20],
            ['category_id' => 2, 'product_name' => 'Nova Country Cheddar', 'description' => 'Cheese flavored chips', 'price' => 15.00, 'stock_qty' => 80, 'unit' => 'pack', 'reorder_level' => 15],
            // Beverages (3)
            ['category_id' => 3, 'product_name' => 'Coke Mismo', 'description' => '300ml Coca-Cola', 'price' => 20.00, 'stock_qty' => 48, 'unit' => 'bottle', 'reorder_level' => 12],
            ['category_id' => 3, 'product_name' => 'Cobra Energy Drink', 'description' => 'Energy drink bottle', 'price' => 25.00, 'stock_qty' => 4, 'unit' => 'bottle', 'reorder_level' => 10],
            // Frozen Products (4)
            ['category_id' => 4, 'product_name' => 'Frozen Pork Siomai (30 pcs)', 'description' => 'Pack of 30 pcs frozen siomai', 'price' => 120.00, 'stock_qty' => 25, 'unit' => 'pack', 'reorder_level' => 8],
            ['category_id' => 4, 'product_name' => 'Frozen Hotdog Jumbo (1kg)', 'description' => 'Tender jumbo hotdog for grilling or frying', 'price' => 95.00, 'stock_qty' => 20, 'unit' => 'pack', 'reorder_level' => 6],
            ['category_id' => 4, 'product_name' => 'Frozen Ice Candy Assorted (10 pcs)', 'description' => 'Mango, orange, chocolate ice candy', 'price' => 50.00, 'stock_qty' => 40, 'unit' => 'pack', 'reorder_level' => 12],
            ['category_id' => 4, 'product_name' => 'Frozen Lumpia Shanghai (25 pcs)', 'description' => 'Pork shanghai lumpia ready to fry', 'price' => 110.00, 'stock_qty' => 20, 'unit' => 'pack', 'reorder_level' => 6],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        CustomerDebt::create([
            'customer_name' => 'Mercy Santos',
            'customer_phone' => '09171234567',
            'amount' => 150.00,
            'amount_paid' => 50.00,
            'description' => 'Groceries on credit',
            'debt_date' => now()->subDays(3)->toDateString(),
            'status' => 'open',
            'recorded_by' => $staff1->user_id,
        ]);

        CustomerDebt::create([
            'customer_name' => 'Kuya Ben',
            'customer_phone' => '09189876543',
            'amount' => 85.00,
            'amount_paid' => 85.00,
            'description' => 'Snack house items',
            'debt_date' => now()->subDays(7)->toDateString(),
            'status' => 'paid',
            'recorded_by' => $jojo->user_id,
            'paid_at' => now()->subDays(2),
        ]);
    }
}
