<?php

namespace App\Services\Payments;

class CyberSourceSignature
{
    public static function buildDataToSign(array $params): string
    {
        $signedFieldNames = explode(',', $params['signed_field_names'] ?? '');
        $data = [];
        foreach ($signedFieldNames as $name) {
            $data[] = $name . '=' . ($params[$name] ?? '');
        }
        return implode(',', $data);
    }

    public static function sign(array $params, string $secretKey): string
    {
        $data = self::buildDataToSign($params);
        return base64_encode(hash_hmac('sha256', $data, $secretKey, true));
    }

    public static function verify(array $params, string $secretKey): bool
    {
        if (!isset($params['signature'])) {
            return false;
        }
        $expected = self::sign($params, $secretKey);
        return hash_equals($expected, $params['signature']);
    }
}
