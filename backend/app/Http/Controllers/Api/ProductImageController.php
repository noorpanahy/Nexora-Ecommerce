<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120',
            ],
        ]);

        $uploadedImages = [];

        foreach ($request->file('images') as $file) {
            $path = $file->store(
                'products',
                'public'
            );

            $image = $product->images()->create([
                'image' => $path,
                'is_primary' => $product->images()->count() === 0,
            ]);

            $uploadedImages[] = $image;
        }

        return response()->json([
            'message' => 'Images uploaded successfully.',
            'images' => $uploadedImages,
        ], 201);
    }

    public function destroy(ProductImage $productImage)
{
    $product = $productImage->product;

    $wasPrimary = $productImage->is_primary;

    Storage::disk('public')->delete(
        $productImage->image
    );

    $productImage->delete();

    if ($wasPrimary) {
        $newPrimary = $product
            ->images()
            ->first();

        if ($newPrimary) {
            $newPrimary->update([
                'is_primary' => true,
            ]);
        }
    }

    return response()->json([
        'message' => 'Image deleted successfully.',
    ]);
}

    public function setPrimary(ProductImage $productImage)
    {
        $product = $productImage->product;

        // Remove primary status from all images.
        $product->images()->update([
            'is_primary' => false,
        ]);

        // Make selected image primary.
        $productImage->update([
            'is_primary' => true,
        ]);

        return response()->json([
            'message' => 'Primary image updated successfully.',
            'image' => $productImage,
        ]);
    }
}