<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function loadCategories()
    {
        $categories = Category::where('is_deleted', false)->get();

        return response()->json([
            'categories' => $categories,
        ], 200);
    }

    public function getCategory($categoryId)
    {
        $category = Category::find($categoryId);

        return response()->json([
            'category' => $category,
        ], 200);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'category_name' => ['required', 'min:2', 'max:60'],
            'description' => ['nullable', 'max:150'],
        ]);

        Category::create($validated);

        return response()->json([
            'message' => 'Category Successfully Saved.',
        ], 200);
    }

    public function updateCategory(Request $request, Category $category)
    {
        $validated = $request->validate([
            'category_name' => ['required', 'min:2', 'max:60'],
            'description' => ['nullable', 'max:150'],
        ]);

        $category->update($validated);

        return response()->json([
            'category' => $category,
            'message' => 'Category Successfully Updated.',
        ], 200);
    }

    public function destroyCategory(Category $category)
    {
        $category->update(['is_deleted' => true]);

        return response()->json([
            'message' => 'Category Successfully Deleted.',
        ], 200);
    }
}
