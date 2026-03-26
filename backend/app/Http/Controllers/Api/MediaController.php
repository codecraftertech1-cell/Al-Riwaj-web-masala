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
     * Upload a file to public/storage folder (images and videos)
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file',
        ]);

        try {
            $file = $request->file('file');
            
            // Determine file type and set appropriate validation and path
            $mimeType = $file->getMimeType();
            $isVideo = strpos($mimeType, 'video/') === 0;
            $isImage = strpos($mimeType, 'image/') === 0;
            
            if (!$isVideo && !$isImage) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only image and video files are allowed'
                ], 422);
            }
            
            // Set max size: 10MB for images, 100MB for videos
            $maxSize = $isVideo ? 100000 : 2048; // KB
            $maxSizeStr = $isVideo ? '100MB' : '2MB';
            
            // Generate unique filename
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Choose upload directory based on file type
            $subFolder = $isVideo ? 'videos' : 'products';
            $uploadPath = public_path('storage/' . $subFolder);
            
            if (!File::exists($uploadPath)) {
                File::makeDirectory($uploadPath, 0755, true);
            }
            
            // Store file content
            $fileContent = file_get_contents($file->getRealPath());
            file_put_contents($uploadPath . '/' . $fileName, $fileContent);
            
            $filePath = 'storage/' . $subFolder . '/' . $fileName;

            return response()->json([
                'success' => true,
                'data' => [
                    'file_name' => $fileName,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $mimeType,
                    'file_size' => strlen($fileContent),
                    'file_path' => $filePath,
                    'url' => asset($filePath)
                ],
                'path' => $filePath,
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
            'file_name' => 'nullable|string',
            'original_name' => 'nullable|string',
            'mime_type' => 'nullable|string',
            'file_path' => 'nullable|string',
            'file_size' => 'nullable|string',
            'alt_text' => 'nullable|string',
            'caption' => 'nullable|string',
            'category' => 'nullable|string',
            'is_active' => 'boolean',
            'created_at' => 'nullable|date',
        ]);

        $media = Media::create($validated);

        // Handle created_at if provided
        if ($request->has('created_at')) {
            $media->created_at = new \DateTime($request->created_at);
            $media->save();
        }

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
            'created_at' => 'nullable|date',
        ]);

        $media->update($validated);

        // Handle created_at update separately if provided
        if ($request->has('created_at')) {
            $media->created_at = new \DateTime($request->created_at);
            $media->save();
        }

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
