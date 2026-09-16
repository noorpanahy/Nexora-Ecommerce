<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    /**
     * Upload product images.
     */
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
            $path = $file->store('products', 'public');

            $isPrimary =
                $product->images()->count() === 0;

            $image = $product->images()->create([
                'image' => $path,
                'is_primary' => $isPrimary,
            ]);

            $uploadedImages[] = $image;
        }

        return response()->json([
            'message' => 'Images uploaded successfully.',
            'images' => $uploadedImages,
        ], 201);
    }

    /**
     * Delete a product image.
     */
    public function destroy(ProductImage $productImage)
    {
        $product = $productImage->product;

        $wasPrimary = $productImage->is_primary;

        // Delete physical file
        Storage::disk('public')->delete(
            $productImage->image
        );

        // Delete database record
        $productImage->delete();

        // If primary image was deleted,
        // make another image primary.
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

    /**
     * Set an image as the primary image.
     */
    public function setPrimary(ProductImage $productImage)
    {
        $product = $productImage->product;

        // Remove primary status from all images.
        $product->images()->update([
            'is_primary' => false,
        ]);

        // Set selected image as primary.
        $productImage->update([
            'is_primary' => true,
        ]);

        return response()->json([
            'message' => 'Primary image updated successfully.',
            'image' => $productImage,
        ]);
    }
}
