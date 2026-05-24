<?php

namespace App\Support;

class PhoneNormalizer
{
    /** Normalize Philippine mobile numbers to 09XXXXXXXXX */
    public static function normalize(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone) ?? '';

        if ($digits === '') {
            return '';
        }

        if (str_starts_with($digits, '63') && strlen($digits) >= 12) {
            $digits = substr($digits, 2);
        }

        if (strlen($digits) >= 10) {
            $last10 = substr($digits, -10);
            if (str_starts_with($last10, '9')) {
                return '0' . $last10;
            }
        }

        if (strlen($digits) === 11 && str_starts_with($digits, '09')) {
            return $digits;
        }

        return $digits;
    }
}
