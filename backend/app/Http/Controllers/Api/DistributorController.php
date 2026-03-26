<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Distributor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DistributorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Distributor::query();

        // If not authenticated (public), only show active and verified
        $token = $request->bearerToken();
        if (!$token) {
            $query->where('is_active', true)->where('is_verified', true);
        }

        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->has('verified')) {
            $query->where('is_verified', true);
        }

        $distributors = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $distributors
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'country' => 'string|max:100',
            'region' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        $distributor = Distributor::create($validated);

        return response()->json([
            'success' => true,
            'data' => $distributor,
            'message' => 'Distributor request submitted successfully'
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $distributor = Distributor::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $distributor
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $distributor = Distributor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'company_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string|max:100',
            'country' => 'string|max:100',
            'region' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $distributor->update($validated);

        return response()->json([
            'success' => true,
            'data' => $distributor,
            'message' => 'Distributor updated successfully'
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $distributor = Distributor::findOrFail($id);
        $distributor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Distributor deleted successfully'
        ]);
    }
}
