<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payments\CyberSourceSignature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CyberSourceController extends Controller
{
    private function getConfig(): array
    {
        $row = DB::table('business_settings')
            ->where('key', 'cybersource')
            ->first();

        $value = $row ? json_decode($row->value ?? '{}', true) : [];

        return [
            'status' => (int)($value['status'] ?? 0),
            'environment' => $value['environment'] ?? 'sandbox',
            'profile_id' => $value['profile_id'] ?? '',
            'access_key' => $value['access_key'] ?? '',
            'secret_key' => $value['secret_key'] ?? '',
            'currency' => $value['currency'] ?? 'USD',
        ];
    }

    private function getEndpoint(string $environment): string
    {
        return $environment === 'live'
            ? 'https://secureacceptance.cybersource.com/pay'
            : 'https://testsecureacceptance.cybersource.com/pay';
    }

    private function formatAmount($order): string
    {
        $amount = $order->grand_total ?? $order->order_amount ?? $order->amount ?? 0;
        return number_format((float)$amount, 2, '.', '');
    }

    public function initiate(Request $request, Order $order)
    {
        $config = $this->getConfig();
        abort_unless($config['status'] === 1, 404, 'CyberSource disabled');

        $fields = [
            'access_key' => $config['access_key'],
            'profile_id' => $config['profile_id'],
            'transaction_uuid' => (string) Str::uuid(),
            'signed_field_names' => 'access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,response_url,cancel_url',
            'unsigned_field_names' => '',
            'signed_date_time' => gmdate("Y-m-d\\TH:i:s\\Z"),
            'locale' => 'en-us',
            'transaction_type' => 'sale',
            'reference_number' => (string)$order->id,
            'amount' => $this->formatAmount($order),
            'currency' => $config['currency'],
            'response_url' => route('cybersource.callback'),
            'cancel_url' => route('cybersource.cancel'),
        ];

        $fields['signature'] = CyberSourceSignature::sign($fields, $config['secret_key']);

        return view('payments.cybersource_redirect', [
            'endpoint' => $this->getEndpoint($config['environment']),
            'fields' => $fields,
        ]);
    }

    public function callback(Request $request)
    {
        $config = $this->getConfig();

        $posted = $request->all();
        if (!isset($posted['signed_field_names'], $posted['signature'])) {
            return redirect()->route('payment.failed');
        }

        $isValid = CyberSourceSignature::verify($posted, $config['secret_key']);
        $decision = $posted['decision'] ?? 'ERROR';
        $orderId = $posted['req_reference_number'] ?? $posted['reference_number'] ?? null;

        if (!$isValid || !$orderId) {
            Log::warning('CyberSource invalid callback', ['order' => $orderId]);
            return redirect()->route('payment.failed');
        }

        $order = Order::find($orderId);
        if (!$order) {
            return redirect()->route('payment.failed');
        }

        if ($decision === 'ACCEPT') {
            $order->payment_status = 'paid';
            if (property_exists($order, 'transaction_id')) {
                $order->transaction_id = $posted['transaction_id'] ?? null;
            }
            $order->save();

            return redirect()->route('payment.success');
        }

        $order->payment_status = 'failed';
        $order->save();

        return redirect()->route('payment.failed');
    }

    public function cancel()
    {
        return redirect()->route('payment.failed');
    }
}
