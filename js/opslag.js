// OPSLAG: alles wat met het bewaren van bestellingen en beschikbaarheid te maken heeft.
//
// Alles staat in de Supabase-database (tabellen `bestellingen` en
// `beschikbaarheid`). De database beslist wie wat mag zien:
//   - iedereen (ook gasten) mag een bestelling plaatsen;
//   - een klant ziet alleen zijn eigen bestellingen;
//   - alleen de slager ziet alle bestellingen en mag de status veranderen.
//
// De functies met `async` praten met de database: gebruik ze met `await`.
window.Bouzian = window.Bouzian || {};

(function () {
  const db = Bouzian.db;

  let beschikbaar = {};   // { productId: false } als iets uitverkocht is
  let bestellingen = [];  // laatst opgehaalde bestellingen

  // Rij uit de database -> bestelling zoals de rest van de site ze kent
  function naarBestelling(r) {
    return {
      id: r.id,
      code: Bouzian.config.codePrefix + r.id,
      klantId: r.klant_id,
      name: r.naam,
      phone: r.telefoon,
      email: r.email,
      note: r.opmerking,
      pickup: r.ophalen,
      items: r.items,
      total: Number(r.totaal),
      status: r.status,
      tijdstip: r.tijdstip
    };
  }

  function controleer(error) {
    if (error) {
      console.error('Database:', error);
      throw new Error('Er ging iets mis met de verbinding. Probeer het opnieuw.');
    }
  }

  Bouzian.opslag = {
    STATUSSEN: ['Nieuw', 'Voorbereiding', 'Klaar', 'Afgehaald'],
    LABELS: {
      Nieuw: 'Nieuw',
      Voorbereiding: 'In voorbereiding',
      Klaar: 'Klaar om af te halen',
      Afgehaald: 'Afgehaald'
    },

    // ---------- Beschikbaarheid ----------
    async laadBeschikbaarheid() {
      const { data, error } = await db.from('beschikbaarheid').select('product_id, beschikbaar');
      controleer(error);
      beschikbaar = {};
      data.forEach(r => { beschikbaar[r.product_id] = r.beschikbaar; });
    },

    isBeschikbaar(productId) {
      return beschikbaar[productId] !== false;
    },

    async zetBeschikbaar(productId, waarde) {
      const { error } = await db.from('beschikbaarheid').upsert({ product_id: productId, beschikbaar: waarde });
      controleer(error);
      beschikbaar[productId] = waarde;
    },

    // ---------- Bestellingen ----------
    // Haalt de bestellingen op die deze gebruiker mag zien (slager: alles)
    async laadBestellingen() {
      const { data, error } = await db.from('bestellingen').select('*').order('id', { ascending: false });
      controleer(error);
      bestellingen = data.map(naarBestelling);
    },

    alleBestellingen() {
      return bestellingen.slice();
    },

    async bestellingenVanKlant(klantId) {
      const { data, error } = await db.from('bestellingen').select('*')
        .eq('klant_id', klantId).order('id', { ascending: false });
      controleer(error);
      return data.map(naarBestelling);
    },

    // Plaatst een bestelling en geeft ze terug met nummer (id) en code (BZ-1001)
    async plaatsBestelling(g) {
      const { data: id, error } = await db.rpc('plaats_bestelling', {
        p_naam: g.name,
        p_telefoon: g.phone,
        p_email: g.email,
        p_opmerking: g.note,
        p_ophalen: g.pickup,
        p_items: g.items,
        p_totaal: Math.round(g.total * 100) / 100
      });
      controleer(error);
      return Object.assign({}, g, {
        id: id,
        code: Bouzian.config.codePrefix + id,
        status: 'Nieuw',
        tijdstip: new Date().toISOString()
      });
    },

    async zetStatus(code, status) {
      const b = bestellingen.find(x => x.code === code);
      if (!b) return;
      const { error } = await db.from('bestellingen').update({ status: status }).eq('id', b.id);
      controleer(error);
      b.status = status;
    }
  };
})();
