<?php

namespace App\Http\Controllers;

use App\Models\Hero;
use App\Models\HomeComponentOrder;
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
                'bgImage' => 'nullable|string|max:500',
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

    /**
     * Get variant-specific hero data
     */
    public function getVariantData(string $variant): JsonResponse
    {
        try {
            // Find the component variant
            $component = HomeComponentOrder::where('component_id', 'resort-hero')
                ->where('variant_name', $variant)
                ->where('is_active', true)
                ->first();

            if (!$component) {
                return response()->json([
                    'message' => 'Variant not found'
                ], 404);
            }

            // Get the default hero data
            $defaultHero = Hero::getActive();
            $defaultData = $defaultHero ? [
                'title' => $defaultHero->title,
                'location' => $defaultHero->location,
                'stars' => $defaultHero->stars,
                'bg_image_url' => $defaultHero->bg_image_url,
                'bg_image' => $defaultHero->bg_image,
                'bg_image_alt' => $defaultHero->bg_image_alt,
                'bg_image_name' => $defaultHero->bg_image_name,
                'rating_score' => $defaultHero->rating_score,
                'rating_reviews' => $defaultHero->rating_reviews,
                'chips' => $defaultHero->chips,
                'chip_images' => $defaultHero->chip_images
            ] : [
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
            ];

            // For getVariantData (used by Banner page), prioritize draft_data over component_data
            $variantData = null;
            if ($component->draft_data && is_array($component->draft_data) && count($component->draft_data) > 0) {
                $variantData = $component->draft_data;
                Log::info('Using draft data for variant', ['variant' => $variant, 'draft_data' => $variantData]);
            } else {
                $variantData = $component->component_data ?? [];
                Log::info('Using component data for variant', ['variant' => $variant, 'component_data' => $variantData]);
            }

            // Only merge non-null values to avoid overriding default data with null
            $filteredVariantData = array_filter($variantData, function($value) {
                return $value !== null;
            });

            $mergedData = array_merge($defaultData, $filteredVariantData);

            Log::info('Variant data response', [
                'variant' => $variant,
                'defaultData' => $defaultData,
                'variantData' => $variantData,
                'filteredVariantData' => $filteredVariantData,
                'mergedData' => $mergedData
            ]);

            return response()->json($mergedData);

        } catch (\Exception $e) {
            Log::error('Error getting variant hero data', [
                'variant' => $variant,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to get variant data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update variant-specific hero data
     */
    public function updateVariantData(Request $request, string $variant): JsonResponse
    {
        try {
            // Find the component variant
            $component = HomeComponentOrder::where('component_id', 'resort-hero')
                ->where('variant_name', $variant)
                ->where('is_active', true)
                ->first();

            if (!$component) {
                return response()->json([
                    'message' => 'Variant not found'
                ], 404);
            }

            // Validate the request data (accept both camelCase and snake_case)
            $validatedData = $request->validate([
                'title' => 'nullable|string|max:255',
                'location' => 'nullable|string|max:255',
                'stars' => 'nullable|integer|min:1|max:5',
                'bgImageUrl' => 'nullable|string|max:500',
                'bg_image_url' => 'nullable|string|max:500',
                'bgImageAlt' => 'nullable|string|max:255',
                'bg_image_alt' => 'nullable|string|max:255',
                'bgImageName' => 'nullable|string|max:255',
                'bg_image_name' => 'nullable|string|max:255',
                'ratingScore' => 'nullable|string|max:50',
                'rating_score' => 'nullable|string|max:50',
                'ratingReviews' => 'nullable|string|max:100',
                'rating_reviews' => 'nullable|string|max:100',
                'chips' => 'nullable|array',
                'chipImages' => 'nullable|array',
                'chip_images' => 'nullable|array',
                'bgImage' => 'nullable|string|max:500',
                'bg_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            // Handle file upload if present
            if ($request->hasFile('bg_image')) {
                $file = $request->file('bg_image');
                $filename = 'hero-bg-' . $variant . '-' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/hero', $filename);

                // Update the validated data with the file path
                $validatedData['bgImage'] = 'hero/' . $filename;
                $validatedData['bgImageUrl'] = null; // Clear URL when uploading file
            }

            // Normalize field names to camelCase
            $normalizedData = [];
            foreach ($validatedData as $key => $value) {
                if ($key === 'bg_image_url' && !isset($normalizedData['bgImageUrl'])) {
                    $normalizedData['bgImageUrl'] = $value;
                } elseif ($key === 'bg_image_alt' && !isset($normalizedData['bgImageAlt'])) {
                    $normalizedData['bgImageAlt'] = $value;
                } elseif ($key === 'bg_image_name' && !isset($normalizedData['bgImageName'])) {
                    $normalizedData['bgImageName'] = $value;
                } elseif ($key === 'rating_score' && !isset($normalizedData['ratingScore'])) {
                    $normalizedData['ratingScore'] = $value;
                } elseif ($key === 'rating_reviews' && !isset($normalizedData['ratingReviews'])) {
                    $normalizedData['ratingReviews'] = $value;
                } elseif ($key === 'chip_images' && !isset($normalizedData['chipImages'])) {
                    $normalizedData['chipImages'] = $value;
                } else {
                    // Include all other fields (including camelCase fields like bgImage)
                    $normalizedData[$key] = $value;
                }
            }

            // Update the component data
            $component->component_data = $normalizedData;
            $component->save();

            Log::info('Variant hero data updated', [
                'variant' => $variant,
                'data' => $normalizedData
            ]);

            return response()->json([
                'message' => 'Variant data updated successfully',
                'data' => $normalizedData
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating variant hero data', [
                'variant' => $variant,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to update variant data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update variant data as draft (not live)
     */
    public function updateVariantDataDraft(Request $request, string $variant): JsonResponse
    {
        try {
            Log::info('Draft variant update called', [
                'variant' => $variant,
                'has_file' => $request->hasFile('bg_image'),
                'all_data' => $request->all(),
                'files' => $request->allFiles(),
                'content_type' => $request->header('Content-Type'),
                'request_method' => $request->method(),
                'request_size' => $request->header('Content-Length'),
                'input_keys' => array_keys($request->all()),
                'file_keys' => array_keys($request->allFiles()),
                'raw_content' => substr($request->getContent(), 0, 500) // First 500 chars of raw content
            ]);

            // Find the component variant
            $component = HomeComponentOrder::where('component_id', 'resort-hero')
                ->where('variant_name', $variant)
                ->where('is_active', true)
                ->first();

            if (!$component) {
                return response()->json([
                    'message' => 'Variant not found'
                ], 404);
            }

            // Validate the request data (accept both camelCase and snake_case)
            $validatedData = $request->validate([
                'title' => 'nullable|string|max:255',
                'location' => 'nullable|string|max:255',
                'stars' => 'nullable|integer|min:1|max:5',
                'bgImageUrl' => 'nullable|string|max:500',
                'bg_image_url' => 'nullable|string|max:500',
                'bgImageAlt' => 'nullable|string|max:255',
                'bg_image_alt' => 'nullable|string|max:255',
                'bgImageName' => 'nullable|string|max:255',
                'bg_image_name' => 'nullable|string|max:255',
                'ratingScore' => 'nullable|string|max:50',
                'rating_score' => 'nullable|string|max:50',
                'ratingReviews' => 'nullable|string|max:100',
                'rating_reviews' => 'nullable|string|max:100',
                'chips' => 'nullable|array',
                'chipImages' => 'nullable|array',
                'chip_images' => 'nullable|array',
                'bgImage' => 'nullable|string|max:500',
                'bg_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            // Handle file upload if present
            Log::info('Checking for file upload', [
                'variant' => $variant,
                'has_file' => $request->hasFile('bg_image'),
                'all_files' => $request->allFiles()
            ]);

            if ($request->hasFile('bg_image')) {
                $file = $request->file('bg_image');
                $filename = 'hero-bg-' . $variant . '-draft-' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/hero', $filename);

                // Update the validated data with the file path
                $validatedData['bgImage'] = 'hero/' . $filename;
                $validatedData['bgImageUrl'] = null; // Clear URL when uploading file

                Log::info('Variant image uploaded', [
                    'variant' => $variant,
                    'filename' => $filename,
                    'path' => $path,
                    'bgImage' => $validatedData['bgImage']
                ]);
            } else {
                Log::info('No file uploaded for variant', [
                    'variant' => $variant,
                    'has_file' => $request->hasFile('bg_image')
                ]);
            }

            // Normalize field names to camelCase
            $normalizedData = [];
            foreach ($validatedData as $key => $value) {
                if ($key === 'bg_image_url' && !isset($normalizedData['bgImageUrl'])) {
                    $normalizedData['bgImageUrl'] = $value;
                } elseif ($key === 'bg_image_alt' && !isset($normalizedData['bgImageAlt'])) {
                    $normalizedData['bgImageAlt'] = $value;
                } elseif ($key === 'bg_image_name' && !isset($normalizedData['bgImageName'])) {
                    $normalizedData['bgImageName'] = $value;
                } elseif ($key === 'rating_score' && !isset($normalizedData['ratingScore'])) {
                    $normalizedData['ratingScore'] = $value;
                } elseif ($key === 'rating_reviews' && !isset($normalizedData['ratingReviews'])) {
                    $normalizedData['ratingReviews'] = $value;
                } elseif ($key === 'chip_images' && !isset($normalizedData['chipImages'])) {
                    $normalizedData['chipImages'] = $value;
                } else {
                    // Include all other fields (including camelCase fields like bgImage)
                    $normalizedData[$key] = $value;
                }
            }

            // Save as draft data (separate from live data)
            $component->draft_data = $normalizedData;
            $component->save();

            // Clean up the response data - remove the UploadedFile object
            $cleanData = $normalizedData;
            unset($cleanData['bg_image']); // Remove the UploadedFile object

            Log::info('Variant hero draft data updated', [
                'variant' => $variant,
                'data' => $cleanData
            ]);

            return response()->json([
                'message' => 'Variant draft data updated successfully',
                'data' => $cleanData
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating variant hero draft data', [
                'variant' => $variant,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to update variant draft data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
