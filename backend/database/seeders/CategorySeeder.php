<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Recipe Mixes',
                'slug' => 'recipe-mixes',
                'description' => 'Easy-to-use recipe mixes for authentic Pakistani dishes',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Cooking Sauces',
                'slug' => 'cooking-sauces',
                'description' => 'Ready-to-cook sauces for quick and delicious meals',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Spices & Masala',
                'slug' => 'spices-masala',
                'description' => 'Premium quality spices and masala blends',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Staples',
                'slug' => 'staples',
                'description' => 'Essential cooking staples for every kitchen',
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        echo "Categories seeded successfully!\n";
    }
}
