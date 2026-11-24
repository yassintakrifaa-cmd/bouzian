// AANBOD op de homepage (index.html): toont alle producten uit producten.js,
// per categorie, met hun prijs. Wat de slager op uitverkocht zette, staat erbij.
(async function () {
  const { $, euro, esc } = Bouzian.helpers;
  const opslag = Bouzian.opslag;

  // Producten groeperen per categorie (in de volgorde van producten.js)
  const categorieen = [];
  Bouzian.producten.forEach(p => {
    let groep = categorieen.find(c => c.naam === p.cat);
    if (!groep) {
      groep = { naam: p.cat, producten: [] };
      categorieen.push(groep);
    }
    groep.producten.push(p);
  });

  function regel(p) {
    const op = !opslag.isBeschikbaar(p.id);
    return `
      <li${op ? ' class="out"' : ''}>
        <span>${esc(p.name)}${op ? '<span class="badge">Uitverkocht</span>' : ''}</span>
        <span>${euro(p.price)} / ${p.unit === 'kg' ? 'kg' : 'stuk'}</span>
      </li>`;
  }

  function toon() {
    $('productenLijst').innerHTML = categorieen.map(c => `
      <article class="cat-card">
        <h3>${esc(c.naam)}</h3>
        <ul class="price-list">${c.producten.map(regel).join('')}</ul>
      </article>`).join('');
  }

  // Eerst meteen tonen, daarna aanvullen met wat uitverkocht is
  toon();
  try {
    await opslag.laadBeschikbaarheid();
    toon();
  } catch (err) {
    // Geen verbinding: de lijst blijft gewoon staan, zonder uitverkocht-info
  }
})();
