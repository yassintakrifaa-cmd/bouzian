# Butcher Bouzian – instructies voor Claude

- Antwoord altijd in het Nederlands en leg dingen eenvoudig uit.
- Lees eerst `README.md`: daar staat de structuur en welk bestand wat doet.
- Houd de structuur aan: pagina's in HTML, stijl in `css/`, logica in `js/`. Zet geen CSS of JavaScript in de HTML-bestanden.
- Alle opslag loopt via `js/opslag.js` en alle login via `js/auth.js`. Andere bestanden praten nooit rechtstreeks met localStorage of een database.
- Tekst die klanten invullen altijd tonen via `Bouzian.helpers.esc()`.
- Betalen gebeurt in de winkel: geen online betaling toevoegen.
- Verander alleen wat gevraagd wordt.
