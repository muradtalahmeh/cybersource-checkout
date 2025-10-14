CyberSource Integration Bundle

Files:
1) app/Services/Payments/CyberSourceSignature.php
2) app/Http/Controllers/Payment/CyberSourceController.php
3) database/seeders/CyberSourceSettingSeeder.php
4) resources/views/payments/cybersource_redirect.blade.php
5) resources/views/admin-views/third-party/payment-method/partials/_cybersource.blade.php

Snippets to paste in your project:
- routes/admin.php -> inside third-party/payment-method group:
  Route::post('cybersource/update', 'updateCyberSource')->name('cybersource.update');

- app/Http/Controllers/Admin/ThirdParty/PaymentMethodController.php -> add method updateCyberSource() from snippets/PaymentMethodController_method_updateCyberSource.php

- routes/web.php -> add public routes from snippets/web_routes_cybersource.php

Usage:
- Seed default config: run the seeder or manually insert row in business_settings
- Open Admin > Third-party > Payment method and configure CyberSource
- In checkout, redirect to route('cybersource.initiate', $orderId) when method selected
