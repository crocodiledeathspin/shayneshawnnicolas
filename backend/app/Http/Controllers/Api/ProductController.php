<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function loadProducts(Request $request)
    {
        $page = $request->input('page', 1);
        $search = $request->input('search', '');

        $query = Product::with(['category'])
            ->leftJoin('tbl_categories', 'tbl_products.category_id', '=', 'tbl_categories.category_id')
            ->where('tbl_products.is_deleted', false)
            ->select('tbl_products.*')
            ->orderBy('tbl_products.product_name', 'asc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('tbl_products.product_name', 'like', "%{$search}%")
                    ->orWhere('tbl_categories.category_name', 'like', "%{$search}%")
                    ->orWhere('tbl_products.description', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(15)->appends($request->query());

        $products->getCollection()->transform(function ($product) {
            $product->product_image = $product->product_image
                ? url('storage/img/products/' . $product->product_image)
                : null;
            $product->is_low_stock = $product->stock_qty <= $product->reorder_level;

            return $product;
        });

        return response()->json([
            'products' => $products->items(),
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'has_more_pages' => $products->hasMorePages(),
        ], 200);
    }

    public function loadLowStockProducts()
    {
        $products = Product::with(['category'])
            ->where('is_deleted', false)
            ->whereColumn('stock_qty', '<=', 'reorder_level')
            ->orderBy('stock_qty', 'asc')
            ->get();

        return response()->json([
            'products' => $products,
        ], 200);
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'add_product_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'product_name' => ['required', 'max:100'],
            'category' => ['required', 'exists:tbl_categories,category_id'],
            'description' => ['nullable', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock_qty' => ['required', 'integer', 'min:0'],
            'unit' => ['required', 'max:30'],
            'reorder_level' => ['required', 'integer', 'min:0'],
        ]);

        $imageFilename = null;
        if ($request->hasFile('add_product_image')) {
            $file = $request->file('add_product_image');
            $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $imageFilename = sha1($filename . time()) . '.' . $extension;
            $file->storeAs('img/products', $imageFilename, 'public');
        }

        Product::create([
            'category_id' => $validated['category'],
            'product_name' => $validated['product_name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock_qty' => $validated['stock_qty'],
            'unit' => $validated['unit'],
            'reorder_level' => $validated['reorder_level'],
            'product_image' => $imageFilename,
        ]);

        return response()->json([
            'message' => 'Product Successfully Saved.',
        ], 200);
    }

    public function updateProduct(Request $request, Product $product)
    {
        $validated = $request->validate([
            'edit_product_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'product_name' => ['required', 'max:100'],
            'category' => ['required', 'exists:tbl_categories,category_id'],
            'description' => ['nullable', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock_qty' => ['required', 'integer', 'min:0'],
            'unit' => ['required', 'max:30'],
            'reorder_level' => ['required', 'integer', 'min:0'],
        ]);

        $imageFilename = $product->product_image;

        if ($request->hasFile('edit_product_image')) {
            if ($product->product_image && Storage::disk('public')->exists('img/products/' . $product->product_image)) {
                Storage::disk('public')->delete('img/products/' . $product->product_image);
            }
            $file = $request->file('edit_product_image');
            $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $imageFilename = sha1($filename . '_' . time()) . '.' . $extension;
            $file->storeAs('img/products', $imageFilename, 'public');
        } elseif ($request->has('remove_product_image') && $request->remove_product_image == '1') {
            if ($product->product_image && Storage::disk('public')->exists('img/products/' . $product->product_image)) {
                Storage::disk('public')->delete('img/products/' . $product->product_image);
            }
            $imageFilename = null;
        }

        $product->update([
            'category_id' => $validated['category'],
            'product_name' => $validated['product_name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock_qty' => $validated['stock_qty'],
            'unit' => $validated['unit'],
            'reorder_level' => $validated['reorder_level'],
            'product_image' => $imageFilename,
        ]);

        $product->refresh()->load('category');
        $product->product_image = $product->product_image
            ? url('storage/img/products/' . $product->product_image)
            : null;

        return response()->json([
            'message' => 'Product Successfully Updated.',
            'product' => $product,
        ], 200);
    }

    public function destroyProduct(Product $product)
    {
        $product->update(['is_deleted' => true]);

        return response()->json([
            'message' => 'Product Successfully Deleted.',
        ], 200);
    }
}
