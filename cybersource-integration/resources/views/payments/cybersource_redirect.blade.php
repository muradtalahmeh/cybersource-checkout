<!doctype html>
<html>
  <body onload="document.forms[0].submit()">
    <p>Redirecting to CyberSource...</p>
    <form action="{{ $endpoint }}" method="post">
      @foreach ($fields as $name => $value)
        <input type="hidden" name="{{ $name }}" value="{{ e($value) }}">
      @endforeach
      <noscript><button type="submit">Pay</button></noscript>
    </form>
  </body>
</html>
