<?php
// Public web routes for initiating and handling CyberSource payment
use App\Http\Controllers\Payment\CyberSourceController;

Route::prefix('payment/cybersource')->group(function () {
    Route::get('/initiate/{order}', [CyberSourceController::class, 'initiate'])->name('cybersource.initiate');
    Route::post('/callback', [CyberSourceController::class, 'callback'])->name('cybersource.callback');
    Route::get('/cancel', [CyberSourceController::class, 'cancel'])->name('cybersource.cancel');
});
