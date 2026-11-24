// VERBINDING met de Supabase-database.
// Alleen opslag.js en auth.js gebruiken deze verbinding (Bouzian.db).
// De sleutel in config.js is een "publishable" sleutel: die mag openbaar zijn.
// De beveiliging zit in de regels (RLS) van de database zelf.
window.Bouzian = window.Bouzian || {};

Bouzian.db = window.supabase.createClient(Bouzian.config.supabaseUrl, Bouzian.config.supabaseKey);
