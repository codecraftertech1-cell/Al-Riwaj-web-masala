<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'category_id' => 1,
                'name' => 'Chicken Biryani Masala',
                'slug' => 'chicken-biryani-masala',
                'short_description' => 'Classic biryani blend with rich aroma',
                'description' => 'Premium quality chicken biryani masala perfect for authentic biryani dishes.',
                'sku' => 'BM-001',
                'price' => 450,
                'stock_quantity' => 120,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => 1,
                'name' => 'Seekh Kabab Masala',
                'slug' => 'seekh-kabab-masala',
                'short_description' => 'Perfect blend for juicy seekh kababs',
                'description' => 'Specially formulated masala for delicious seekh kababs.',
                'sku' => 'BM-002',
                'price' => 380,
                'stock_quantity' => 85,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'category_id' => 2,
                'name' => 'Tikka Cooking Sauce',
                'slug' => 'tikka-cooking-sauce',
                'short_description' => 'Ready-to-cook tikka base for quick meals',
                'description' => 'Rich and creamy tikka sauce for instant cooking.',
                'sku' => 'CS-001',
                'price' => 620,
                'stock_quantity' => 75,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'category_id' => 2,
                'name' => 'Karahi Cooking Sauce',
                'slug' => 'karahi-cooking-sauce',
                'short_description' => 'Traditional karahi gravy in minutes',
                'description' => 'Authentic karahi gravy base for restaurant-style dishes.',
                'sku' => 'CS-002',
                'price' => 580,
                'stock_quantity' => 60,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'category_id' => 3,
                'name' => 'Tandoori Masala',
                'slug' => 'tandoori-masala',
                'short_description' => 'Aromatic tandoori spice blend',
                'description' => 'Traditional tandoori masala for grilled dishes.',
                'sku' => 'SP-001',
                'price' => 320,
                'stock_quantity' => 150,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'category_id' => 3,
                'name' => 'Garam Masala',
                'slug' => 'garam-masala',
                'short_description' => 'Premium all-purpose masala',
                'description' => 'A blend of aromatic spices for everyday cooking.',
                'sku' => 'SP-002',
                'price' => 280,
                'stock_quantity' => 200,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'category_id' => 4,
                'name' => 'Cooked Rice (Basmati)',
                'slug' => 'cooked-rice-basmati',
                'short_description' => 'Premium basmati rice, ready to cook',
                'description' => 'Long-grain basmati rice for biryani and pulao.',
                'sku' => 'ST-001',
                'price' => 850,
                'stock_quantity' => 50,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 7,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        echo "Products seeded successfully!\n";
    }
}
