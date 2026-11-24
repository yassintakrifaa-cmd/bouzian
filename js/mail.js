// E-MAIL: bevestiging van een bestelling naar de klant sturen.
//
// NOG NIET ACTIEF. Supabase verstuurt zelf geen bestelmails. Daarvoor komt er
// een Supabase Edge Function die via Resend (www.resend.com) mailt.
// Tot dan wordt er niets verstuurd en tonen we de mail in de Console (F12).
window.Bouzian = window.Bouzian || {};

Bouzian.mail = {
  // Geeft een Promise terug met { ok: true/false, demo: true/false }
  stuurBevestiging(bestelling) {
    console.info('DEMO: bevestiging zou verstuurd worden naar', bestelling.email, bestelling);
    return Promise.resolve({ ok: true, demo: true });
  }
};
