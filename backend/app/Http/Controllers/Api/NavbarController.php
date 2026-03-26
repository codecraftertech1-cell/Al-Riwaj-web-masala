<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NavbarController extends Controller
{
    /**
     * Get navbar visibility settings (public)
     */
    public function index(): JsonResponse
    {
        // Default navbar items with visibility
        $defaultItems = [
            ['key' => 'home', 'label' => 'Home', 'url' => '/', 'visible' => true],
            ['key' => 'about', 'label' => 'About', 'url' => '/about', 'visible' => true],
            ['key' => 'shop', 'label' => 'Shop', 'url' => '/shop', 'visible' => true],
            ['key' => 'our-management', 'label' => 'Our Management', 'url' => '#', 'visible' => true],
            ['key' => 'products', 'label' => 'Products', 'url' => '/products', 'visible' => true],
            ['key' => 'recipes', 'label' => 'Recipes', 'url' => '/recipes', 'visible' => true],
            ['key' => 'media', 'label' => 'Media', 'url' => '/media', 'visible' => true],
            ['key' => 'careers', 'label' => 'Careers', 'url' => '/careers', 'visible' => true],
            ['key' => 'contact', 'label' => 'Contact Us', 'url' => '/contact', 'visible' => true],
        ];

        // Try to get from settings or return default
        $settings = \App\Models\SiteSection::where('section_key', 'navbar_visibility')->first();
        
        if ($settings && $settings->meta_data) {
            $savedItems = json_decode($settings->meta_data, true);
            if ($savedItems) {
                // Check if Shop is missing and add it with default visibility
                $hasShop = collect($savedItems)->contains('key', 'shop');
                if (!$hasShop) {
                    $savedItems[] = ['key' => 'shop', 'label' => 'Shop', 'url' => '/shop', 'visible' => true];
                }
                return response()->json([
                    'success' => true,
                    'data' => $savedItems
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $defaultItems
        ]);
    }

    /**
     * Update navbar visibility settings (admin)
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.key' => 'required|string',
            'items.*.label' => 'required|string',
            'items.*.url' => 'required|string',
            'items.*.visible' => 'required|boolean',
        ]);

        // Save to site_sections table
        $section = \App\Models\SiteSection::updateOrCreate(
            ['section_key' => 'navbar_visibility'],
            [
                'title' => 'Navbar Visibility Settings',
                'content' => json_encode($validated['items']),
                'meta_data' => json_encode($validated['items']),
                'is_active' => true,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $validated['items'],
            'message' => 'Navbar visibility settings updated successfully'
        ]);
    }
}
