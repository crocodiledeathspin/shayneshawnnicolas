<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class N8nWebhookService
{
    public static function notifyOrderPlaced(array $payload): void
    {
        $webhookUrl = config('services.n8n.webhook_url');

        if (empty($webhookUrl)) {
            if (config('app.debug')) {
                Log::info('n8n webhook skipped: set N8N_WEBHOOK_URL in backend/.env', [
                    'event' => $payload['event'] ?? 'unknown',
                ]);
            }

            return;
        }

        try {
            $response = Http::timeout(10)->post($webhookUrl, $payload);

            if (!$response->successful()) {
                Log::warning('n8n webhook returned error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'event' => $payload['event'] ?? null,
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('n8n webhook failed: ' . $e->getMessage(), [
                'event' => $payload['event'] ?? null,
            ]);
        }
    }
}
