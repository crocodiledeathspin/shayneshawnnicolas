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
            return;
        }

        try {
            Http::timeout(10)->post($webhookUrl, $payload);
        } catch (\Throwable $e) {
            Log::warning('n8n webhook failed: ' . $e->getMessage(), $payload);
        }
    }
}
