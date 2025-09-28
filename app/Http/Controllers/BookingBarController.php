<?php

namespace App\Http\Controllers;

use App\Models\BookingBarSettings;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class BookingBarController extends Controller
{
    /**
     * Get the active booking bar settings
     */
    public function getActive(): JsonResponse
    {
        $bookingBar = BookingBarSettings::getActive();

        if (!$bookingBar) {
            // Return default data if no booking bar settings exist
            return response()->json([
                'title' => 'Book your all-inclusive Red Sea escape today.',
                'date_label' => 'Dates',
                'date_value' => '09 Oct – 14 Oct',
                'guests_label' => 'Rooms & Guests',
                'guests_value' => '1 room – 2 guests',
                'cta_text' => 'BOOK NOW',
                'price_currency' => 'USD',
                'price_amount' => '1444.95',
                'price_meta' => '5 nights – 2 guests'
            ]);
        }

        return response()->json([
            'title' => $bookingBar->title,
            'date_label' => $bookingBar->date_label,
            'date_value' => $bookingBar->date_value,
            'guests_label' => $bookingBar->guests_label,
            'guests_value' => $bookingBar->guests_value,
            'cta_text' => $bookingBar->cta_text,
            'price_currency' => $bookingBar->price_currency,
            'price_amount' => $bookingBar->price_amount,
            'price_meta' => $bookingBar->price_meta
        ]);
    }

    /**
     * Update or create booking bar settings
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'dateLabel' => 'required|string|max:255',
                'dateValue' => 'required|string|max:255',
                'guestsLabel' => 'required|string|max:255',
                'guestsValue' => 'required|string|max:255',
                'ctaText' => 'required|string|max:255',
                'priceCurrency' => 'required|string|max:10',
                'priceAmount' => 'required|string|max:50',
                'priceMeta' => 'required|string|max:255'
            ]);

            // Convert camelCase to snake_case for database
            $data = [
                'title' => $validated['title'],
                'date_label' => $validated['dateLabel'],
                'date_value' => $validated['dateValue'],
                'guests_label' => $validated['guestsLabel'],
                'guests_value' => $validated['guestsValue'],
                'cta_text' => $validated['ctaText'],
                'price_currency' => $validated['priceCurrency'],
                'price_amount' => $validated['priceAmount'],
                'price_meta' => $validated['priceMeta']
            ];

            // Get or create the active booking bar
            $bookingBar = BookingBarSettings::getActive();

            if ($bookingBar) {
                $bookingBar->update($data);
            } else {
                $bookingBar = BookingBarSettings::create(array_merge($data, ['is_active' => true]));
            }

            return response()->json([
                'message' => 'Booking bar settings updated successfully',
                'data' => [
                    'title' => $bookingBar->title,
                    'date_label' => $bookingBar->date_label,
                    'date_value' => $bookingBar->date_value,
                    'guests_label' => $bookingBar->guests_label,
                    'guests_value' => $bookingBar->guests_value,
                    'cta_text' => $bookingBar->cta_text,
                    'price_currency' => $bookingBar->price_currency,
                    'price_amount' => $bookingBar->price_amount,
                    'price_meta' => $bookingBar->price_meta
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Booking bar update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'message' => 'An error occurred while updating booking bar settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
