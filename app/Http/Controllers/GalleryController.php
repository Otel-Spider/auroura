<?php

namespace App\Http\Controllers;

use App\Models\GallerySettings;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * Get the active gallery settings
     */
    public function getActive(): JsonResponse
    {
        $gallery = GallerySettings::getActive();

        if (!$gallery) {
            // Return default data if no gallery settings exist
            return response()->json([
                'title' => 'Welcome to Rixos Sharm El Sheikh Adults Only 18+',
                'description' => 'Experience luxury and relaxation at our exclusive adults-only resort. Nestled along the pristine shores of the Red Sea, Rixos Sharm El Sheikh offers an unparalleled escape with world-class amenities, gourmet dining, and breathtaking views. Our all-inclusive experience ensures every moment is crafted to perfection, from sunrise yoga sessions to sunset cocktails by the infinity pool.',
                'check_in' => 'Check-in – 2:00 PM',
                'check_out' => 'Check-out – 12:00 PM',
                'images' => [
                    ['src' => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=450&fit=crop', 'alt' => 'Resort exterior view', 'name' => 'resort-exterior'],
                    ['src' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop', 'alt' => 'Luxury pool area', 'name' => 'luxury-pool'],
                    ['src' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop', 'alt' => 'Beachfront view', 'name' => 'beachfront'],
                    ['src' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=450&fit=crop', 'alt' => 'Spa and wellness center', 'name' => 'spa-wellness'],
                    ['src' => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=450&fit=crop', 'alt' => 'Gourmet restaurant', 'name' => 'restaurant'],
                    ['src' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop', 'alt' => 'Sunset terrace', 'name' => 'sunset-terrace'],
                    ['src' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop', 'alt' => 'Luxury suite interior', 'name' => 'luxury-suite'],
                    ['src' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=450&fit=crop', 'alt' => 'Infinity pool at night', 'name' => 'infinity-pool-night']
                ]
            ]);
        }

        return response()->json([
            'title' => $gallery->title,
            'description' => $gallery->description,
            'check_in' => $gallery->check_in,
            'check_out' => $gallery->check_out,
            'images' => $gallery->images ?: []
        ]);
    }

    /**
     * Update or create gallery settings
     */
    public function update(Request $request): JsonResponse
    {
        try {
            Log::info('Gallery update request received', [
                'method' => $request->method(),
                'all_data' => $request->all()
            ]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'checkIn' => 'required|string|max:255',
                'checkOut' => 'required|string|max:255',
                'images' => 'nullable|array',
                'images.*.src' => 'required|string',
                'images.*.alt' => 'required|string|max:255',
                'images.*.name' => 'required|string|max:255'
            ]);

            // Convert camelCase to snake_case for database
            $data = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'check_in' => $validated['checkIn'],
                'check_out' => $validated['checkOut'],
                'images' => $validated['images'] ?? []
            ];

            // Get or create the active gallery
            $gallery = GallerySettings::getActive();

            if ($gallery) {
                $gallery->update($data);
            } else {
                $gallery = GallerySettings::create(array_merge($data, ['is_active' => true]));
            }

            return response()->json([
                'message' => 'Gallery settings updated successfully',
                'data' => [
                    'title' => $gallery->title,
                    'description' => $gallery->description,
                    'check_in' => $gallery->check_in,
                    'check_out' => $gallery->check_out,
                    'images' => $gallery->images
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Gallery update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'message' => 'An error occurred while updating gallery settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload gallery image
     */
    public function uploadImage(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'alt' => 'required|string|max:255',
                'name' => 'required|string|max:255|regex:/^[a-zA-Z0-9_-]+$/'
            ]);

            $image = $request->file('image');
            $name = $validated['name'];
            $alt = $validated['alt'];

            // Generate filename
            $extension = $image->getClientOriginalExtension();
            $filename = $name . '.' . $extension;

            // Store image
            $path = $image->storeAs('public/gallery', $filename);
            $imagePath = 'gallery/' . $filename;

            return response()->json([
                'message' => 'Image uploaded successfully',
                'data' => [
                    'src' => '/storage/' . $imagePath,
                    'alt' => $alt,
                    'name' => $name,
                    'path' => $imagePath
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Gallery image upload error: ' . $e->getMessage());

            return response()->json([
                'message' => 'An error occurred while uploading the image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete gallery image
     */
    public function deleteImage(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'path' => 'required|string'
            ]);

            $path = str_replace('/storage/', '', $validated['path']);

            if (Storage::exists('public/' . $path)) {
                Storage::delete('public/' . $path);
            }

            return response()->json([
                'message' => 'Image deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Gallery image delete error: ' . $e->getMessage());

            return response()->json([
                'message' => 'An error occurred while deleting the image',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
