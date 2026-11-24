// INLOGGEN voor klanten én voor de slager, via Supabase Auth.
//
// Iedereen logt in met e-mail + wachtwoord. In de tabel `profiles` staat per
// gebruiker de rol: 'klant' (standaard) of 'slager'. Iemand slager maken doe je
// in Supabase: Table Editor → profiles → rol op 'slager' zetten.
//
// De functies met `async` praten met de server: gebruik ze met `await`.
window.Bouzian = window.Bouzian || {};

(function () {
  const db = Bouzian.db;

  // Foutmeldingen van Supabase in gewone taal
  function vertaal(error) {
    const m = (error && error.message || '').toLowerCase();
    if (m.includes('invalid login')) return 'E-mailadres of wachtwoord klopt niet.';
    if (m.includes('already registered')) return 'Er bestaat al een account met dit e-mailadres.';
    if (m.includes('not confirmed')) return 'Bevestig eerst uw e-mailadres via de link in uw mailbox.';
    if (m.includes('password')) return 'Kies een sterker wachtwoord (minstens 6 tekens).';
    if (m.includes('rate limit')) return 'Te veel pogingen. Probeer het over een paar minuten opnieuw.';
    console.error('Auth:', error);
    return 'Er ging iets mis. Probeer het opnieuw.';
  }

  // Profiel van de ingelogde gebruiker, of null
  async function profiel() {
    const { data: { session } } = await db.auth.getSession();
    if (!session) return null;
    const { data, error } = await db.from('profiles').select('id, naam, email, telefoon, rol')
      .eq('id', session.user.id).maybeSingle();
    if (error || !data) return null;
    return data;
  }

  Bouzian.auth = {
    // ===== Klant =====
    // Geeft { ok: true } of { ok: false, fout: 'uitleg' }
    async registreerKlant({ naam, email, telefoon, wachtwoord }) {
      const { data, error } = await db.auth.signUp({
        email: email.trim().toLowerCase(),
        password: wachtwoord,
        options: { data: { naam: naam.trim(), telefoon: telefoon.trim() } }
      });
      if (error) return { ok: false, fout: vertaal(error) };
      if (!data.session) {
        return { ok: false, fout: 'Bijna klaar: we hebben u een e-mail gestuurd. Klik op de link erin en log daarna hier in.' };
      }
      return { ok: true };
    },

    // Geeft '' als het gelukt is, anders de foutmelding
    async inloggen(email, wachtwoord) {
      const { error } = await db.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: wachtwoord });
      return error ? vertaal(error) : '';
    },

    // De ingelogde gebruiker { id, naam, email, telefoon, rol }, of null
    huidigeKlant: profiel,

    async uitloggen() {
      await db.auth.signOut();
    },

    // ===== Slager =====
    async isSlager() {
      const p = await profiel();
      return !!p && p.rol === 'slager';
    },

    // Inloggen op het slagersscherm. Geeft '' als het gelukt is, anders de fout.
    async inloggenSlager(email, wachtwoord) {
      const fout = await this.inloggen(email, wachtwoord);
      if (fout) return fout;
      if (await this.isSlager()) return '';
      await this.uitloggen();
      return 'Dit account heeft geen toegang tot het slagersscherm.';
    },

    // Bovenaan het slagersscherm: geen slager? Terug naar de login.
    async vereisSlager() {
      if (await this.isSlager()) return true;
      window.location.href = 'login.html';
      return false;
    }
  };
})();
