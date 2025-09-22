<?php

namespace App\Http\Controllers;

use App\Models\Hero;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    /**
     * Get the active hero settings
     */
    public function getActive(): JsonResponse
    {
        $hero = Hero::getActive();

        if (!$hero) {
            // Return default data if no hero settings exist
            return response()->json([
                'title' => "Rixos Sharm El Sheikh Adults Only 18+",
                'location' => "Sharm El Sheikh, Egypt",
                'stars' => 5,
                'bg_image_url' => "https://qln0xxt0hw0ogxv1.imgix.net/https%3A%2F%2Fimages.ctfassets.net%2F944fk97h13dc%2F4xadrTCxgBoi6rstnDUJsI%2Ff14ca28071ea66bcf22a16a9f058632a%2FSSH_General_1A.jpg",
                'bg_image' => null,
                'bg_image_alt' => "Resort Hero Background",
                'bg_image_name' => "hero-background",
                'rating_score' => "4.8/5",
                'rating_reviews' => "900 reviews",
                'chips' => [
                    ['key' => 'all-inclusive', 'label' => 'All Inclusive', 'icon' => 'dining', 'enabled' => true],
                    ['key' => 'entertainment', 'label' => 'Entertainment', 'icon' => 'entertainment', 'enabled' => true],
                    ['key' => 'fitness', 'label' => 'Fitness', 'icon' => 'fitness', 'enabled' => true],
                    ['key' => 'wellness', 'label' => 'Wellness', 'icon' => 'wellness', 'enabled' => true],
                    ['key' => 'sports', 'label' => 'Sports', 'icon' => 'sports', 'enabled' => true],
                    ['key' => 'watersports', 'label' => 'Watersports', 'icon' => 'watersports', 'enabled' => true],
                    ['key' => 'beach', 'label' => 'Beach', 'icon' => 'beach', 'enabled' => true],
                    ['key' => 'romance', 'label' => 'Romance', 'icon' => 'romance', 'enabled' => true]
                ],
                'chip_images' => []
            ]);
        }

                return response()->json([
                    'title' => $hero->title,
                    'location' => $hero->location,
                    'stars' => $hero->stars,
                    'bg_image_url' => $hero->bg_image_url,
                    'bg_image' => $hero->bg_image,
                    'bg_image_alt' => $hero->bg_image_alt,
                    'bg_image_name' => $hero->bg_image_name,
                    'rating_score' => $hero->rating_score,
                    'rating_reviews' => $hero->rating_reviews,
                    'chips' => $hero->chips,
                    'chip_images' => $hero->chip_images
                ]);
    }

    /**
     * Update or create hero settings
     */
    public function update(Request $request): JsonResponse
    {
        try {
            \Log::info('Hero update request received', [
                'method' => $request->method(),
                'has_file' => $request->hasFile('bg_image'),
                'all_data' => $request->all()
            ]);
                    // Different validation rules for POST (file upload) vs PUT (JSON data)
                    if ($request->isMethod('post')) {
                        $validated = $request->validate([
                            'title' => 'required|string|max:255',
                            'location' => 'required|string|max:255',
                            'stars' => 'required|integer|min:1|max:5',
                            'bg_image_url' => 'nullable|string', // Allow empty string for file uploads
                            'bg_image_alt' => 'nullable|string|max:255',
                            'bg_image_name' => 'nullable|string|max:255',
                            'bg_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                            'rating_score' => 'required|string|max:50',
                            'rating_reviews' => 'required|string|max:100',
                            'chips' => 'required|string', // JSON string for POST
                            'chip_images' => 'nullable|array',
                            'chip_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:1024'
                        ]);

                        // Parse chips JSON string for POST requests
                        if (isset($validated['chips'])) {
                            $chipsData = json_decode($validated['chips'], true);
                            if (json_last_error() !== JSON_ERROR_NONE) {
                                throw new \Exception('Invalid JSON in chips field: ' . json_last_error_msg());
                            }
                            $validated['chips'] = $chipsData;
                        }

                        // Clean up empty bg_image_url for file uploads
                        if (!isset($validated['bg_image_url']) || empty($validated['bg_image_url'])) {
                            $validated['bg_image_url'] = null;
                        }
                    } else {
                        // For PUT requests, don't validate bg_image if it's not being uploaded
                        $rules = [
                            'title' => 'required|string|max:255',
                            'location' => 'required|string|max:255',
                            'stars' => 'required|integer|min:1|max:5',
                            'bgImageUrl' => 'nullable|url',
                            'bgImageAlt' => 'nullable|string|max:255',
                            'bgImageName' => 'nullable|string|max:255',
                            'ratingScore' => 'required|string|max:50',
                            'ratingReviews' => 'required|string|max:100',
                            'chips' => 'required|array',
                            'chips.*.key' => 'required|string',
                            'chips.*.label' => 'required|string',
                            'chips.*.icon' => 'required|string',
                            'chips.*.enabled' => 'required|boolean'
                        ];

                        $validated = $request->validate($rules);

                        // Convert camelCase to snake_case for database
                        $validated['bg_image_url'] = $validated['bgImageUrl'] ?? null;
                        $validated['bg_image_alt'] = $validated['bgImageAlt'] ?? null;
                        $validated['bg_image_name'] = $validated['bgImageName'] ?? null;
                        $validated['rating_score'] = $validated['ratingScore'];
                        $validated['rating_reviews'] = $validated['ratingReviews'];
                        $validated['chip_images'] = $validated['chipImages'] ?? [];
                        unset($validated['bgImageUrl'], $validated['bgImageAlt'], $validated['bgImageName'], $validated['ratingScore'], $validated['ratingReviews'], $validated['chipImages']);
                    }

            // Handle background image upload
            if ($request->hasFile('bg_image')) {
                $image = $request->file('bg_image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/hero', $imageName);
                $validated['bg_image'] = 'hero/' . $imageName;
                \Log::info('Background image uploaded successfully', ['image_path' => $validated['bg_image']]);
            }

            // Handle chip images upload
            if ($request->hasFile('chip_images')) {
                $chipImages = [];
                foreach ($request->file('chip_images') as $key => $image) {
                    if ($image) {
                        $imageName = time() . '_chip_' . $key . '.' . $image->getClientOriginalExtension();
                        $image->storeAs('public/hero/chips', $imageName);
                        $chipImages[$key] = 'hero/chips/' . $imageName;
                    }
                }
                $validated['chip_images'] = $chipImages;
                \Log::info('Chip images uploaded successfully', ['chip_images' => $chipImages]);
            }

            // Get or create the active hero
            $hero = Hero::getActive();

            if ($hero) {
                $hero->update($validated);
            } else {
                $hero = Hero::create(array_merge($validated, ['is_active' => true]));
            }

            return response()->json([
                'message' => 'Hero settings updated successfully',
                        'data' => [
                            'title' => $hero->title,
                            'location' => $hero->location,
                            'stars' => $hero->stars,
                            'bg_image_url' => $hero->bg_image_url,
                            'bg_image' => $hero->bg_image,
                            'bg_image_alt' => $hero->bg_image_alt,
                            'bg_image_name' => $hero->bg_image_name,
                            'rating_score' => $hero->rating_score,
                            'rating_reviews' => $hero->rating_reviews,
                            'chips' => $hero->chips,
                            'chip_images' => $hero->chip_images
                        ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Hero update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'message' => 'An error occurred while updating hero settings',
                'error' => $e->getMessage(),
                'details' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Get all hero settings (for admin)
     */
    public function index(): JsonResponse
    {
        $heroes = Hero::orderBy('created_at', 'desc')->get();

        return response()->json($heroes);
    }

    /**
     * Rename background image file
     */
    public function renameBackgroundImage(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'old_path' => 'required|string',
                'new_name' => 'required|string|max:255|regex:/^[a-zA-Z0-9_-]+$/',
            ]);

            $oldPath = $validated['old_path'];
            $newName = $validated['new_name'];

            // Remove /storage/ prefix if present
            $oldPath = str_replace('/storage/', '', $oldPath);

            // Get file extension
            $extension = pathinfo($oldPath, PATHINFO_EXTENSION);
            $newPath = 'hero/' . $newName . '.' . $extension;

            // Check if old file exists
            if (!Storage::exists('public/' . $oldPath)) {
                return response()->json([
                    'message' => 'Original file not found',
                    'error' => 'File does not exist'
                ], 404);
            }

            // Check if new file already exists
            if (Storage::exists('public/' . $newPath)) {
                return response()->json([
                    'message' => 'File with this name already exists',
                    'error' => 'File already exists'
                ], 409);
            }

            // Move/rename the file
            Storage::move('public/' . $oldPath, 'public/' . $newPath);

            // Update database record
            $hero = Hero::getActive();
            if ($hero) {
                $hero->update(['bg_image' => $newPath]);
            }

            return response()->json([
                'message' => 'File renamed successfully',
                'data' => [
                    'old_path' => $oldPath,
                    'new_path' => $newPath,
                    'new_url' => '/storage/' . $newPath
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('File rename error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'message' => 'An error occurred while renaming the file',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a hero setting
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $hero = Hero::findOrFail($id);
            $hero->delete();

            return response()->json([
                'message' => 'Hero setting deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while deleting hero setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
