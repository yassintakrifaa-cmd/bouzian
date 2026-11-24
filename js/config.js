// Gegevens van de winkel. Pas hier aan als iets verandert.
window.Bouzian = window.Bouzian || {};

Bouzian.config = {
  naam: 'Butcher Bouzian',
  telefoon: '+32 487 25 81 28',
  adres: 'Weerstandlaan 46, 2660 Antwerpen',
  codePrefix: 'BZ-',          // begin van elk bestelnummer (BZ-1001)
  sluitingsdag: 3,            // 0 = zondag, 1 = maandag, ... 3 = woensdag
  ophaalVan: 9,               // eerste ophaaluur
  ophaalTot: 18,              // laatste ophaaluur (18:00 is het laatste slot)
  dagenVooruit: 7,            // hoeveel dagen klanten vooruit kunnen bestellen

  // Supabase-project "Bouzian" (deze sleutel mag openbaar zijn)
  supabaseUrl: 'https://ezehxdinpsrjfxksbqki.supabase.co',
  supabaseKey: 'sb_publishable_lDKHTsf6hi1IpT6D35_VBw_VFu_DE4C'
};
