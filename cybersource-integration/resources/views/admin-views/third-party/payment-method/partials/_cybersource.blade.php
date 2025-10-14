@php
  $row = \Illuminate\Support\Facades\DB::table('business_settings')->where(['key'=>'cybersource','type'=>'payment_method'])->first();
  $cs = $row ? json_decode($row->value ?? '{}', true) : [];
@endphp

<form action="{{ route('third-party.payment-method.cybersource.update') }}" method="post" class="card mb-3">
  @csrf
  <div class="card-header d-flex align-items-center justify-content-between">
    <strong>CyberSource</strong>
    <label class="switch mb-0">
      <input type="checkbox" name="status" value="1" {{ ($cs['status'] ?? 0) ? 'checked' : '' }}>
      <span class="slider"></span>
    </label>
  </div>

  <div class="card-body">
    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label">Environment</label>
        <select name="environment" class="form-select" required>
          <option value="sandbox" {{ ($cs['environment'] ?? 'sandbox')==='sandbox'?'selected':'' }}>Sandbox</option>
          <option value="live" {{ ($cs['environment'] ?? '')==='live'?'selected':'' }}>Live</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Profile ID</label>
        <input name="profile_id" class="form-control" value="{{ $cs['profile_id'] ?? '' }}" required>
      </div>
      <div class="col-md-4">
        <label class="form-label">Access Key</label>
        <input name="access_key" class="form-control" value="{{ $cs['access_key'] ?? '' }}" required>
      </div>
      <div class="col-md-12">
        <label class="form-label">Secret Key</label>
        <input name="secret_key" class="form-control" value="{{ $cs['secret_key'] ?? '' }}" required>
      </div>
      <div class="col-md-3">
        <label class="form-label">Currency</label>
        <input name="currency" class="form-control" value="{{ $cs['currency'] ?? 'USD' }}" required>
      </div>
    </div>
  </div>

  <div class="card-footer text-end">
    <button class="btn btn-primary" type="submit">Save</button>
  </div>
</form>
