<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class MediaController extends Controller
{
    /**
     * Upload a file to public/storage/products folder
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        try {
            $file = $request->file('file');
            
            // Generate unique filename
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Create products directory in public folder if not exists
            $uploadPath = public_path('storage/products');
            if (!File::exists($uploadPath)) {
                File::makeDirectory($uploadPath, 0755, true);
            }
            
            // Store file content directly to avoid temp file issues
            $fileContent = file_get_contents($file->getRealPath());
            file_put_contents($uploadPath . '/' . $fileName, $fileContent);
            
            $filePath = 'storage/products/' . $fileName;

            return response()->json([
                'success' => true,
                'data' => [
                    'file_name' => $fileName,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => strlen($fileContent),
                    'file_path' => $filePath,
                    'url' => asset($filePath)
                ],
                'message' => 'File uploaded successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete uploaded file
     */
    public function deleteFile(Request $request): JsonResponse
    {
        $request->validate([
            'file_path' => 'required|string',
        ]);

        try {
            $filePath = public_path($request->file_path);
            
            if (File::exists($filePath)) {
                File::delete($filePath);
                return response()->json([
                    'success' => true,
                    'message' => 'File deleted successfully'
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage()
            ], 500);
        }
    }
    public function index(Request $request): JsonResponse
    {
        $query = Media::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $media = $query->active()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $media
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file_name' => 'required|string',
            'original_name' => 'required|string',
            'mime_type' => 'required|string',
            'file_path' => 'required|string',
            'file_size' => 'required|string',
            'alt_text' => 'nullable|string',
            'caption' => 'nullable|string',
            'category' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $media = Media::create($validated);

        return response()->json([
            'success' => true,
            'data' => $media,
            'message' => 'Media created successfully'
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $media
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $media = Media::findOrFail($id);

        $validated = $request->validate([
            'file_name' => 'sometimes|string',
            'original_name' => 'sometimes|string',
            'alt_text' => 'nullable|string',
            'caption' => 'nullable|string',
            'category' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $media->update($validated);

        return response()->json([
            'success' => true,
            'data' => $media,
            'message' => 'Media updated successfully'
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Media deleted successfully'
        ]);
    }
}
