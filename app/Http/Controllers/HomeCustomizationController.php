<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HomeComponentOrder;
use Illuminate\Support\Facades\DB;

class HomeCustomizationController extends Controller
{
    // Default component order
    private $defaultComponents = [
        'resort-hero',
        'booking-bar',
        'resort-intro-gallery',
        'facilities',
        'rooms-section',
        'entertainment-strip',
        'dining-carousel',
        'activity-showcase',
        'activities-grid',
        'wellness-pairs-slider',
        'offers-deck',
        'events-showcase',
        'location-map',
        'guest-reviews',
        'vertical-spotlight-slider',
        'become-member'
    ];

    /**
     * Get the current component order
     */
    public function getComponentOrder()
    {
        $orders = HomeComponentOrder::where('is_active', true)
            ->where(function($query) {
                $query->where('is_visible', true)
                      ->orWhereNull('is_visible'); // Include components where is_visible is null (default visible)
            })
            ->orderBy('order_position')
            ->get();

        // If no custom order exists, return default order
        if ($orders->isEmpty()) {
            return response()->json([
                'components' => $this->defaultComponents,
                'is_default' => true
            ]);
        }

        $components = $orders->map(function($order) {
            return [
                'id' => $order->component_id,
                'variant_name' => $order->variant_name,
                'display_name' => $order->display_name,
                'is_visible' => $order->is_visible ?? true, // Default to true if null
                'is_original' => $order->is_original ?? true, // Default to true if null
                'component_data' => $order->component_data,
                'draft_data' => $order->draft_data
            ];
        })->toArray();

        return response()->json([
            'components' => $components,
            'is_default' => false
        ]);
    }

    /**
     * Update the component order
     */
    public function updateComponentOrder(Request $request)
    {
        $request->validate([
            'components' => 'required|array',
            'components.*' => 'string'
        ]);

        try {
            DB::beginTransaction();

            // Get all current active components
            $currentComponents = HomeComponentOrder::where('is_active', true)->get();


            // Update order positions for existing components
            foreach ($request->components as $index => $componentIdentifier) {
                // Parse the component identifier to handle variants
                // Look for variant pattern: component-id-variant_xxxxx
                $variantPattern = '/^(.+)-variant_[a-f0-9]+$/';

                if (preg_match($variantPattern, $componentIdentifier, $matches)) {
                    $baseComponentId = $matches[1];
                    $variantName = str_replace($baseComponentId . '-', '', $componentIdentifier);
                } else {
                    $baseComponentId = $componentIdentifier;
                    $variantName = null;
                }

                // Find the specific component with this base ID and variant
                $matchingComponent = $currentComponents->where('component_id', $baseComponentId)
                    ->where('variant_name', $variantName)
                    ->first();

                if ($matchingComponent) {
                    $matchingComponent->update(['order_position' => $index + 1]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Component order updated successfully',
                'components' => $request->components
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update component order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset to default component order
     */
    public function resetToDefault()
    {
        try {
            DB::beginTransaction();

            // Deactivate all current orders
            HomeComponentOrder::where('is_active', true)->update(['is_active' => false]);

            DB::commit();

            return response()->json([
                'message' => 'Component order reset to default',
                'components' => $this->defaultComponents
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to reset component order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle component visibility
     */
    public function toggleVisibility(Request $request)
    {
        $request->validate([
            'component_id' => 'required|string',
            'variant_name' => 'nullable|string'
        ]);

        try {
            $query = HomeComponentOrder::where('component_id', $request->component_id)
                ->where('is_active', true);

            if ($request->variant_name) {
                $query->where('variant_name', $request->variant_name);
            } else {
                $query->whereNull('variant_name');
            }

            $component = $query->first();

            if (!$component) {
                return response()->json([
                    'message' => 'Component not found'
                ], 404);
            }

            $component->is_visible = !$component->is_visible;
            $component->save();

            return response()->json([
                'message' => 'Component visibility updated',
                'is_visible' => $component->is_visible
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to toggle component visibility',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Duplicate a component
     */
    public function duplicateComponent(Request $request)
    {
        $request->validate([
            'component_id' => 'required|string|in:' . implode(',', $this->defaultComponents),
            'display_name' => 'required|string|max:255'
        ]);

        try {
            DB::beginTransaction();

            // Get the highest order position
            $maxPosition = HomeComponentOrder::where('is_active', true)->max('order_position') ?? 0;

            // Create the duplicate
            $duplicate = HomeComponentOrder::create([
                'component_id' => $request->component_id,
                'variant_name' => uniqid('variant_'),
                'display_name' => $request->display_name,
                'order_position' => $maxPosition + 1,
                'is_active' => true,
                'is_visible' => true,
                'is_original' => false,
                'component_data' => null // Start with no custom data
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Component duplicated successfully',
                'component' => $duplicate
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to duplicate component',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update component data for a variant
     *
     * This allows you to store custom data for duplicated components.
     * For example, for resort-hero variants, you can store:
     * {
     *   "title": "Custom Hero Title",
     *   "location": "Custom Location",
     *   "bgImageUrl": "custom-background.jpg",
     *   "chips": [...],
     *   "ratingScore": "5.0/5",
     *   "ratingReviews": "1000 reviews"
     * }
     */
    public function updateComponentData(Request $request)
    {
        $request->validate([
            'component_id' => 'required|string',
            'variant_name' => 'nullable|string',
            'component_data' => 'required|array',
            'is_draft' => 'nullable|boolean'
        ]);

        try {
            $query = HomeComponentOrder::where('component_id', $request->component_id)
                ->where('is_active', true);

            if ($request->variant_name) {
                $query->where('variant_name', $request->variant_name);
            } else {
                $query->whereNull('variant_name');
            }

            $component = $query->first();

            if (!$component) {
                return response()->json([
                    'message' => 'Component not found'
                ], 404);
            }

            // Save to draft_data if is_draft is true, otherwise save to component_data
            if ($request->is_draft) {
                $component->draft_data = $request->component_data;
            } else {
                $component->component_data = $request->component_data;
            }
            $component->save();

            return response()->json([
                'message' => $request->is_draft ? 'Component draft data updated successfully' : 'Component data updated successfully',
                'component' => $component
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update component data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a component variant
     */
    public function deleteVariant(Request $request)
    {
        try {
            $request->validate([
                'component_id' => 'required|string',
                'variant_name' => 'required|string'
            ]);

            $component = HomeComponentOrder::where('component_id', $request->component_id)
                ->where('variant_name', $request->variant_name)
                ->where('is_active', true)
                ->first();

            if (!$component) {
                return response()->json([
                    'message' => 'Variant not found'
                ], 404);
            }

            // Check if it's the original component (can't delete original)
            if ($component->is_original) {
                return response()->json([
                    'message' => 'Cannot delete the original component'
                ], 400);
            }

            // Soft delete by setting is_active to false
            $component->is_active = false;
            $component->save();

            return response()->json([
                'message' => 'Variant deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete variant',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
