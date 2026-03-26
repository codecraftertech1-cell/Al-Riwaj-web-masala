<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Get all orders for admin.
     */
    public function index(Request $request)
    {
        $query = Order::with('distributor')->orderBy('created_at', 'desc');
        
        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Filter by distributor
        if ($request->has('distributor_id') && $request->distributor_id) {
            $query->where('distributor_id', $request->distributor_id);
        }
        
        $orders = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Create a new order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'distributor_id' => 'nullable|exists:distributors,id',
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'nullable|in:pending,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $order = new Order();
        $order->distributor_id = $validated['distributor_id'] ?? null;
        $order->order_number = Order::generateOrderNumber();
        $order->items = json_encode($validated['items']);
        $order->total_amount = $validated['total_amount'];
        $order->status = $validated['status'] ?? 'pending';
        $order->notes = $validated['notes'] ?? null;
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'data' => $order->load('distributor')
        ], 201);
    }

    /**
     * Get a single order.
     */
    public function show($id)
    {
        $order = Order::with('distributor')->find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Update an order.
     */
    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $validated = $request->validate([
            'distributor_id' => 'nullable|exists:distributors,id',
            'items' => 'sometimes|required|array|min:1',
            'items.*.name' => 'required_with:items|string',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.price' => 'required_with:items|numeric|min:0',
            'total_amount' => 'sometimes|required|numeric|min:0',
            'status' => 'nullable|in:pending,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['items'])) {
            $order->items = json_encode($validated['items']);
        }
        
        $order->distributor_id = $validated['distributor_id'] ?? $order->distributor_id;
        $order->total_amount = $validated['total_amount'] ?? $order->total_amount;
        $order->status = $validated['status'] ?? $order->status;
        $order->notes = $validated['notes'] ?? $order->notes;
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully',
            'data' => $order->load('distributor')
        ]);
    }

    /**
     * Delete an order.
     */
    public function destroy($id)
    {
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully'
        ]);
    }
}
