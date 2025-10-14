<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CyberSourceSettingSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('business_settings')->updateOrInsert(
            ['key' => 'cybersource', 'type' => 'payment_method'],
            ['value' => json_encode([
                'status' => 0,
                'environment' => 'sandbox',
                'profile_id' => '',
                'access_key' => '',
                'secret_key' => '',
                'currency' => 'USD',
            ])]
        );
    }
}
