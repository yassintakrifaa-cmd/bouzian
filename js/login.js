// LOGINPAGINA (slager/login.html)
(function () {
  const { $ } = Bouzian.helpers;

  // Al ingelogd als slager? Meteen door naar het scherm.
  Bouzian.auth.isSlager().then(ok => { if (ok) window.location.href = 'index.html'; });

  ['user', 'pass'].forEach(id => $(id).addEventListener('input', () => { $('err').textContent = ''; }));

  $('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('user').value;
    const wachtwoord = $('pass').value;

    if (!email.trim() || !wachtwoord) {
      $('err').textContent = 'Vul je e-mailadres en wachtwoord in.';
      return;
    }

    const knop = $('loginForm').querySelector('button[type="submit"]');
    knop.disabled = true;
    const fout = await Bouzian.auth.inloggenSlager(email, wachtwoord);
    knop.disabled = false;

    if (!fout) {
      window.location.href = 'index.html';
    } else {
      $('err').textContent = fout;
      $('pass').value = '';
      $('pass').focus();
    }
  });
})();
