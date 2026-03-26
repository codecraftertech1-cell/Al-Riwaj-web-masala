<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SiteSectionController extends Controller
{
    public function index(): JsonResponse
    {
        $sections = SiteSection::active()->get();
        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }

    public function indexAdmin(): JsonResponse
    {
        $sections = SiteSection::all();
        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'section_key' => 'required|string|unique:site_sections,section_key',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $section = SiteSection::create($validated);

        return response()->json([
            'success' => true,
            'data' => $section,
            'message' => 'Site section created successfully'
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $section = SiteSection::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $section
        ]);
    }

    public function showByKey(string $key): JsonResponse
    {
        $section = SiteSection::where('section_key', $key)->first();
        
        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $section
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $section = SiteSection::findOrFail($id);

        $validated = $request->validate([
            'section_key' => 'sometimes|string|unique:site_sections,section_key,' . $id,
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $section->update($validated);

        return response()->json([
            'success' => true,
            'data' => $section,
            'message' => 'Site section updated successfully'
        ]);
    }

    public function updateByKey(Request $request, string $key): JsonResponse
    {
        $section = SiteSection::where('section_key', $key)->first();
        
        if (!$section) {
            // Create new section if not exists
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'nullable|string',
                'image' => 'nullable|string',
                'is_active' => 'boolean',
            ]);
            
            $section = SiteSection::create([
                'section_key' => $key,
                'title' => $validated['title'],
                'content' => $validated['content'] ?? '',
                'image' => $validated['image'] ?? '',
                'is_active' => $validated['is_active'] ?? true,
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $section,
                'message' => 'Site section created successfully'
            ]);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $section->update($validated);

        return response()->json([
            'success' => true,
            'data' => $section,
            'message' => 'Site section updated successfully'
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $section = SiteSection::findOrFail($id);
        $section->delete();

        return response()->json([
            'success' => true,
            'message' => 'Site section deleted successfully'
        ]);
    }
}
