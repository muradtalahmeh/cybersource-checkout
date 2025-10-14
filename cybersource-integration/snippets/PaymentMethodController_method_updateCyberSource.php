<?php
// Add this method into App\Http\Controllers\Admin\ThirdParty\PaymentMethodController
public function updateCyberSource(\Illuminate\Http\Request $request)
{
    $payload = $request->validate([
        'status' => 'nullable|in:1',
        'environment' => 'required|in:sandbox,live',
        'profile_id' => 'required|string',
        'access_key' => 'required|string',
        'secret_key' => 'required|string',
        'currency' => 'required|string',
    ]);

    $normalized = [
        'status' => isset($payload['status']) ? 1 : 0,
        'environment' => $payload['environment'],
        'profile_id' => $payload['profile_id'],
        'access_key' => $payload['access_key'],
        'secret_key' => $payload['secret_key'],
        'currency' => $payload['currency'],
    ];

    \Illuminate\Support\Facades\DB::table('business_settings')->updateOrInsert(
        ['key' => 'cybersource', 'type' => 'payment_method'],
        ['value' => json_encode($normalized)]
    );

    return back()->with('success', 'CyberSource settings updated');
}
