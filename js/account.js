// KLANTACCOUNT (account.html): inloggen, account maken en eigen bestellingen bekijken.
(function () {
  const { $, euro, esc } = Bouzian.helpers;
  const auth = Bouzian.auth;
  const opslag = Bouzian.opslag;

  // Kwam de klant van de bestelpagina? Dan na het inloggen terug daarheen.
  const terugNaarBestellen = new URLSearchParams(window.location.search).get('terug') === 'bestellen';

  function naInloggen() {
    if (terugNaarBestellen) window.location.href = 'bestellen.html';
    else toon();
  }

  // Knop uitzetten zolang we op de server wachten
  async function bezig(form, tekst, taak) {
    const knop = form.querySelector('button[type="submit"]');
    const oud = knop.textContent;
    knop.disabled = true;
    knop.textContent = tekst;
    try { return await taak(); } finally { knop.disabled = false; knop.textContent = oud; }
  }

  // ---------- Bestellingen van de klant ----------
  function datum(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('nl-BE') + ' ' + d.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
  }

  function kaart(b) {
    return `
      <article class="order">
        <div class="order-head">
          <h3><span class="order-id">${esc(b.code)}</span></h3>
          <span class="status s-${b.status}">${opslag.LABELS[b.status]}</span>
        </div>
        <div class="meta">Besteld op ${datum(b.tijdstip)} · Ophalen: <strong>${esc(b.pickup)}</strong></div>
        <ul>${b.items.map(it => `<li>${esc(it.q)} ${esc(it.name)}</li>`).join('')}</ul>
        ${b.note ? `<div class="meta">Opmerking: ${esc(b.note)}</div>` : ''}
        <div class="meta">Geschat totaal: ${euro(b.total)} · betalen in de winkel</div>
      </article>`;
  }

  // ---------- Juiste scherm tonen ----------
  async function toon() {
    const klant = await auth.huidigeKlant();
    $('loginView').hidden = !!klant;
    $('accountView').hidden = !klant;
    if (!klant) return;

    $('klantNaam').textContent = klant.naam || klant.email;
    $('klantGegevens').textContent = klant.email + (klant.telefoon ? ' · ' + klant.telefoon : '');
    $('mijnBestellingen').innerHTML = '<p class="hint">Bestellingen laden…</p>';

    try {
      const lijst = await opslag.bestellingenVanKlant(klant.id);
      $('mijnBestellingen').innerHTML = lijst.length
        ? lijst.map(kaart).join('')
        : '<div class="panel empty">U hebt nog geen bestellingen geplaatst.</div>';
    } catch (err) {
      $('mijnBestellingen').innerHTML = `<div class="panel empty">${esc(err.message)}</div>`;
    }
  }

  // ---------- Inloggen ----------
  $('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('loginEmail').value;
    const wachtwoord = $('loginPass').value;
    if (!email.trim() || !wachtwoord) {
      $('loginErr').textContent = 'Vul uw e-mailadres en wachtwoord in.';
      return;
    }
    const fout = await bezig($('loginForm'), 'Bezig…', () => auth.inloggen(email, wachtwoord));
    if (!fout) {
      $('loginForm').reset();
      naInloggen();
    } else {
      $('loginErr').textContent = fout;
      $('loginPass').value = '';
      $('loginPass').focus();
    }
  });

  // ---------- Account maken ----------
  $('regForm').addEventListener('submit', async e => {
    e.preventDefault();
    const gegevens = {
      naam: $('regName').value.trim(),
      email: $('regEmail').value.trim(),
      telefoon: $('regPhone').value.trim(),
      wachtwoord: $('regPass').value
    };
    const fout = tekst => { $('regErr').textContent = tekst; };

    if (!gegevens.naam) return fout('Vul uw naam in.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gegevens.email)) return fout('Vul een geldig e-mailadres in.');
    if (gegevens.telefoon.replace(/\D/g, '').length < 9) return fout('Vul een geldig telefoonnummer in.');
    if (gegevens.wachtwoord.length < 6) return fout('Kies een wachtwoord van minstens 6 tekens.');

    const resultaat = await bezig($('regForm'), 'Bezig…', () => auth.registreerKlant(gegevens));
    if (!resultaat.ok) return fout(resultaat.fout);
    $('regForm').reset();
    naInloggen();
  });

  ['loginEmail', 'loginPass'].forEach(id => $(id).addEventListener('input', () => { $('loginErr').textContent = ''; }));
  ['regName', 'regEmail', 'regPhone', 'regPass'].forEach(id => $(id).addEventListener('input', () => { $('regErr').textContent = ''; }));

  $('logout').addEventListener('click', async () => {
    await auth.uitloggen();
    toon();
  });

  // ---------- Start ----------
  toon();
})();
