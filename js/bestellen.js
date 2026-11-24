// BESTELPAGINA voor klanten (bestellen.html)
(async function () {
  const { $, euro, esc, stap, hoeveelheid } = Bouzian.helpers;
  const producten = Bouzian.producten;
  const opslag = Bouzian.opslag;
  const config = Bouzian.config;
  let klant = null; // null = bestellen als gast

  let mandje = {}; // { productId: aantal }

  // ---------- Klant: ingelogd of gast ----------
  function toonKlant() {
    if (klant) {
      $('klantInfo').innerHTML = `Ingelogd als <strong>${esc(klant.naam)}</strong> · <a href="account.html">Mijn account</a>`;
      $('name').value = klant.naam;
      $('phone').value = klant.telefoon;
      $('email').value = klant.email;
    } else {
      $('klantInfo').innerHTML = 'Al klant? <a href="account.html?terug=bestellen">Log in</a>. Zonder account bestelt u als gast en krijgt u de bevestiging per e-mail.';
    }
  }

  // ---------- Producten tonen ----------
  function toonProducten() {
    let html = '';
    let vorigeCategorie = '';

    producten.forEach(p => {
      if (p.cat !== vorigeCategorie) {
        html += `<p class="cat">${p.cat}</p>`;
        vorigeCategorie = p.cat;
      }
      const beschikbaar = opslag.isBeschikbaar(p.id);
      if (!beschikbaar) delete mandje[p.id];
      const aantal = mandje[p.id] || 0;

      html += `
        <div class="prod${beschikbaar ? '' : ' out'}">
          <div>
            <div class="name">${p.name}${beschikbaar ? '' : '<span class="badge">Tijdelijk uitverkocht</span>'}</div>
            <div class="price">${euro(p.price)} per ${p.unit}</div>
          </div>
          <div class="qty">
            <button type="button" data-id="${p.id}" data-d="-1" aria-label="Minder ${p.name}" ${!beschikbaar || !aantal ? 'disabled' : ''}>−</button>
            <output>${aantal ? hoeveelheid(p, aantal) : '0'}</output>
            <button type="button" data-id="${p.id}" data-d="1" aria-label="Meer ${p.name}" ${beschikbaar ? '' : 'disabled'}>+</button>
          </div>
        </div>`;
    });

    $('productList').innerHTML = html;
    toonMandje();
  }

  // ---------- Overzicht rechts ----------
  function gekozenProducten() {
    return producten.filter(p => mandje[p.id]);
  }

  function totaal() {
    return gekozenProducten().reduce((som, p) => som + p.price * mandje[p.id], 0);
  }

  function toonMandje() {
    const items = gekozenProducten();
    $('lines').innerHTML = items.length
      ? items.map(p => `<div><span>${hoeveelheid(p, mandje[p.id])} ${p.name}</span><span>${euro(p.price * mandje[p.id])}</span></div>`).join('')
      : '<p class="hint">Nog niets gekozen.</p>';
    $('total').textContent = euro(totaal());
  }

  // ---------- Ophaaldagen en -uren ----------
  function vulOphaalmomenten() {
    const dagnamen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
    const vandaag = new Date();
    const dagen = [];

    for (let i = 0; dagen.length < config.dagenVooruit && i < 14; i++) {
      const d = new Date(vandaag.getFullYear(), vandaag.getMonth(), vandaag.getDate() + i);
      if (d.getDay() === config.sluitingsdag) continue;
      const naam = i === 0 ? 'Vandaag' : i === 1 ? 'Morgen' : dagnamen[d.getDay()];
      dagen.push(`<option>${naam} ${d.getDate()}/${d.getMonth() + 1}</option>`);
    }
    $('day').innerHTML = dagen.join('');

    const uren = [];
    for (let u = config.ophaalVan; u <= config.ophaalTot; u++) {
      uren.push(`<option>${String(u).padStart(2, '0')}:00</option>`);
      if (u < config.ophaalTot) uren.push(`<option>${String(u).padStart(2, '0')}:30</option>`);
    }
    $('time').innerHTML = uren.join('');
  }

  // ---------- Controle en versturen ----------
  function fout(tekst, veld) {
    $('err').textContent = tekst;
    if (veld) $(veld).focus();
  }

  async function plaatsBestelling(e) {
    e.preventDefault();
    const items = gekozenProducten();
    const naam = $('name').value.trim();
    const telefoon = $('phone').value.trim();
    const email = $('email').value.trim();

    if (!items.length) return fout('Kies eerst minstens één product.');
    if (!naam) return fout('Vul uw naam in.', 'name');
    if (telefoon.replace(/\D/g, '').length < 9) return fout('Vul een geldig telefoonnummer in.', 'phone');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fout('Vul een geldig e-mailadres in voor de bevestiging.', 'email');

    const knop = $('orderForm').querySelector('button[type="submit"]');
    knop.disabled = true;
    knop.textContent = 'Bezig met versturen…';
    let bestelling;
    try {
      bestelling = await opslag.plaatsBestelling({
        name: naam,
        phone: telefoon,
        email: email,
        note: $('note').value.trim(),
        pickup: $('day').value + ' om ' + $('time').value,
        items: items.map(p => ({ name: p.name, q: hoeveelheid(p, mandje[p.id]), sub: p.price * mandje[p.id] })),
        total: totaal()
      });
    } catch (err) {
      return fout('Uw bestelling kon niet verstuurd worden. Probeer het opnieuw of bel de winkel.');
    } finally {
      knop.disabled = false;
      knop.textContent = 'Bestelling plaatsen';
    }

    $('doneCode').textContent = bestelling.code;
    const ophaalTekst = `U kunt uw bestelling ophalen ${bestelling.pickup.toLowerCase()}. Vermeld dit nummer in de winkel. Betalen gebeurt bij het afhalen.`;
    $('doneText').textContent = ophaalTekst + ` Een bevestiging wordt verstuurd naar ${bestelling.email}…`;
    Bouzian.mail.stuurBevestiging(bestelling).then(r => {
      const mailTekst = r.demo
        ? ` (Demo: er is geen echte e-mail verstuurd naar ${bestelling.email}.)`
        : r.ok
          ? ` We hebben een bevestiging gestuurd naar ${bestelling.email}.`
          : ` De bevestigingsmail kon niet verstuurd worden. Noteer dus zeker uw bestelnummer.`;
      $('doneText').textContent = ophaalTekst + mailTekst;
    });
    $('doneAccount').hidden = !klant;
    $('shop').hidden = true;
    $('done').hidden = false;

    mandje = {};
    $('orderForm').reset();
    toonKlant();
    vulOphaalmomenten();
    window.scrollTo(0, 0);
  }

  // ---------- Knoppen koppelen ----------
  $('productList').addEventListener('click', e => {
    const knop = e.target.closest('button[data-id]');
    if (!knop) return;
    const p = producten.find(x => x.id === knop.dataset.id);
    const nieuw = Math.max(0, (mandje[p.id] || 0) + stap(p) * Number(knop.dataset.d));
    if (nieuw) mandje[p.id] = nieuw; else delete mandje[p.id];
    toonProducten();
  });

  ['name', 'phone', 'email'].forEach(id => $(id).addEventListener('input', () => { $('err').textContent = ''; }));
  $('orderForm').addEventListener('submit', plaatsBestelling);
  $('again').addEventListener('click', () => {
    $('done').hidden = true;
    $('shop').hidden = false;
    toonProducten();
  });

  // ---------- Start ----------
  vulOphaalmomenten();
  $('productList').innerHTML = '<p class="hint">Producten laden…</p>';
  try {
    [klant] = await Promise.all([Bouzian.auth.huidigeKlant(), opslag.laadBeschikbaarheid()]);
  } catch (err) {
    $('err').textContent = 'Kon de beschikbaarheid niet laden. Vernieuw de pagina.';
  }
  toonKlant();
  toonProducten();
})();
