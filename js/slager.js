// SLAGERSSCHERM (slager/index.html): bestellingen beheren en producten op uitverkocht zetten.
(async function () {
  const { $, euro, esc } = Bouzian.helpers;

  // Niet ingelogd als slager? Dan stuurt vereisSlager terug naar de login.
  if (!(await Bouzian.auth.vereisSlager())) return;
  const opslag = Bouzian.opslag;
  const producten = Bouzian.producten;

  // ---------- Bestellingen ----------
  function kaart(b) {
    const i = opslag.STATUSSEN.indexOf(b.status);
    const volgende = opslag.STATUSSEN[i + 1];
    const knop = volgende
      ? `<button class="btn small" type="button" data-code="${b.code}" data-to="${volgende}">Zet op: ${opslag.LABELS[volgende]}</button>`
      : '';

    const besteld = new Date(b.tijdstip).toLocaleString('nl-BE', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });

    return `
      <article class="order">
        <div class="order-head">
          <h3><span class="order-id">${esc(b.code)}</span> · ${esc(b.name)}</h3>
          <span class="status s-${b.status}">${opslag.LABELS[b.status]}</span>
        </div>
        <div>Ophalen: <strong>${esc(b.pickup)}</strong> · Tel: ${esc(b.phone)}${b.email ? ` · ${esc(b.email)}` : ''}</div>
        <ul>${b.items.map(it => `<li>${esc(it.q)} ${esc(it.name)}</li>`).join('')}</ul>
        ${b.note ? `<div><em>Opmerking:</em> ${esc(b.note)}</div>` : ''}
        <div class="meta">Besteld ${besteld} · ${b.klantId ? 'klantaccount' : 'gast'} · geschat ${euro(b.total)} · betalen in de winkel</div>
        <div class="actions">${knop}</div>
      </article>`;
  }

  // Tellers bovenaan: hoeveel bestellingen per status
  function toonTellers() {
    const alle = opslag.alleBestellingen();
    $('stats').innerHTML = ['Nieuw', 'Voorbereiding', 'Klaar'].map(s =>
      `<div class="stat"><b>${alle.filter(b => b.status === s).length}</b><span>${opslag.LABELS[s]}</span></div>`
    ).join('');
  }

  function toonBestellingen() {
    toonTellers();
    const zoek = $('search').value.trim().toUpperCase();
    const alle = opslag.alleBestellingen();
    const lijst = zoek
      ? alle.filter(b => b.code.includes(zoek) || b.name.toUpperCase().includes(zoek))
      : alle;

    if (!alle.length) {
      $('ordersView').innerHTML = '<div class="panel empty">Nog geen bestellingen.</div>';
      return;
    }
    if (!lijst.length) {
      $('ordersView').innerHTML = '<div class="panel empty">Geen bestelling gevonden.</div>';
      return;
    }

    const open = lijst.filter(b => b.status !== 'Afgehaald');
    const afgehaald = lijst.filter(b => b.status === 'Afgehaald');
    $('ordersView').innerHTML =
      open.map(kaart).join('') +
      (afgehaald.length ? `<p class="group-title">Afgehaald (${afgehaald.length})</p>` + afgehaald.map(kaart).join('') : '');
  }

  // ---------- Producten & uitverkocht ----------
  function toonProducten() {
    $('productsView').innerHTML =
      '<p class="hint">Iets op? Zet het op uitverkocht. Klanten kunnen het dan niet meer bestellen.</p>' +
      producten.map(p => {
        const ok = opslag.isBeschikbaar(p.id);
        return `
          <div class="toggle">
            <span><strong>${p.name}</strong> <span class="hint">${euro(p.price)}/${p.unit}</span></span>
            <button type="button" class="btn small ${ok ? 'ghost' : ''}" data-tog="${p.id}">${ok ? 'Beschikbaar ✓' : 'Uitverkocht'}</button>
          </div>`;
      }).join('');
  }

  // ---------- Tabbladen ----------
  function tab(welke) {
    const bestellingen = welke === 'orders';
    $('ordersSection').hidden = !bestellingen;
    $('productsView').hidden = bestellingen;
    $('searchBox').hidden = !bestellingen;
    $('tOrders').setAttribute('aria-pressed', bestellingen);
    $('tProducts').setAttribute('aria-pressed', !bestellingen);
  }

  // ---------- Knoppen koppelen ----------
  $('ordersView').addEventListener('click', async e => {
    const knop = e.target.closest('button[data-code]');
    if (!knop) return;
    knop.disabled = true;
    try { await opslag.zetStatus(knop.dataset.code, knop.dataset.to); } catch (err) { alert(err.message); }
    toonBestellingen();
  });

  $('productsView').addEventListener('click', async e => {
    const knop = e.target.closest('button[data-tog]');
    if (!knop) return;
    const id = knop.dataset.tog;
    knop.disabled = true;
    try { await opslag.zetBeschikbaar(id, !opslag.isBeschikbaar(id)); } catch (err) { alert(err.message); }
    toonProducten();
  });

  $('search').addEventListener('input', toonBestellingen);
  $('tOrders').addEventListener('click', () => tab('orders'));
  $('tProducts').addEventListener('click', () => tab('products'));
  $('logout').addEventListener('click', async () => {
    await Bouzian.auth.uitloggen();
    window.location.href = '../account.html#personeel';
  });

  // ---------- Start ----------
  async function vernieuw() {
    try {
      await Promise.all([opslag.laadBestellingen(), opslag.laadBeschikbaarheid()]);
      toonBestellingen();
      toonProducten();
    } catch (err) {
      $('ordersView').innerHTML = `<div class="panel empty">${esc(err.message)}</div>`;
    }
  }
  await vernieuw();
  setInterval(vernieuw, 30000); // elke 30 seconden nieuwe bestellingen ophalen
})();
