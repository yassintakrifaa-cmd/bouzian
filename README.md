# Butcher Bouzian – website met online bestellen

Halal slagerij, Weerstandlaan 46, 2660 Antwerpen.
**Status: in opbouw** (voorbeeldprijzen en -foto's; database en login via Supabase).

## Structuur

```
bouzian/
├── index.html            Homepage (info, aanbod, openingsuren, contact)
├── bestellen.html        Bestelpagina voor klanten
├── account.html          Inloggen (kant klanten + kant personeel), klantaccount
├── slager/
│   └── index.html        Slagersscherm: bestellingen + uitverkocht
├── css/
│   ├── style.css         Stijl van de homepage
│   └── app.css           Stijl van bestellen, login en slagersscherm
├── js/
│   ├── config.js         Winkelgegevens (telefoon, sluitingsdag, ophaaluren)
│   ├── producten.js      Productenlijst met prijzen (homepage + bestellen)
│   ├── aanbod.js         Toont de productenlijst op de homepage
│   ├── helpers.js        Kleine hulpfuncties (prijzen, tekst)
│   ├── database.js       Verbinding met Supabase
│   ├── opslag.js         Bestellingen en uitverkocht (Supabase-database)
│   ├── auth.js           Inloggen klant én slager (Supabase Auth)
│   ├── mail.js           Bevestigingsmail naar de klant (nog niet actief)
│   ├── bestellen.js      Logica van de bestelpagina
│   ├── account.js        Logica van de inlogpagina en het klantaccount
│   └── slager.js         Logica van het slagersscherm
└── images/               Eigen foto's van de zaak
```

## Waar pas ik wat aan?

| Ik wil…                                | Bestand              |
| -------------------------------------- | -------------------- |
| een prijs of product aanpassen         | `js/producten.js`    |
| telefoon, sluitingsdag, ophaaluren     | `js/config.js`       |
| teksten op de homepage                 | `index.html`         |
| kleuren of lettertypes                 | `css/style.css`, `css/app.css` |
| iets aan het bestellen veranderen      | `js/bestellen.js`    |
| iets aan het slagersscherm veranderen  | `js/slager.js`       |

## Bekijken in VS Code

1. Open deze map: **File → Open Folder**.
2. Installeer de extensie **Live Server** (VS Code stelt dit zelf voor).
3. Rechtsklik op `index.html` → **Open with Live Server**.
4. Slagersscherm: ga naar `account.html` en log in aan de kant **Personeel**
   met een personeelsaccount (zie hieronder).

Een fout? Druk in de browser op **F12** → tabblad **Console**. Daar staat welk
bestand en welke regel het probleem geeft.

## Hoe de onderdelen samenwerken

1. Klant kiest producten op `bestellen.html` → `bestellen.js`.
2. `bestellen.js` geeft de bestelling aan `opslag.js`, die een uniek
   oplopend bestelnummer (ID) maakt (`BZ-1001`, `BZ-1002`, …) en ze bewaart.
   Het nummer maakt de database; het voorvoegsel `BZ-` staat in `config.js`.
3. Klanten kunnen (hoeft niet) een account maken op `account.html` → `auth.js`.
   Ingelogd worden naam en telefoon vooraf ingevuld en zien ze hun bestellingen
   met de status. Personeel logt in op dezelfde pagina, kant **Personeel**.
4. `slager.js` haalt de bestellingen op uit `opslag.js` en toont ze.
5. Zet de slager iets op uitverkocht, dan bewaart `opslag.js` dat, en
   `bestellen.js` toont het product grijs.

## Supabase (database en login)

Project **Bouzian** op supabase.com (regio Frankfurt). Adres en sleutel staan in
`js/config.js`. In de database:

| Tabel              | Wat                                                   |
| ------------------ | ----------------------------------------------------- |
| `bestellingen`     | alle bestellingen; `id` is het bestelnummer (vanaf 1001) |
| `beschikbaarheid`  | welke producten uitverkocht zijn                      |
| `profiles`         | naam, telefoon en **rol** (`klant` of `slager`) per account |

Beveiliging (RLS): iedereen mag bestellen (ook gasten), een klant ziet alleen
zijn eigen bestellingen, alleen een slager ziet alles en mag status en
uitverkocht aanpassen.

**Personeelsaccounts (bv. baas en werknemer):** op de website kan niemand een
personeelsaccount maken. Dat gebeurt alleen in Supabase:

1. **Authentication → Users → Add user → Create new user**: e-mail + wachtwoord,
   vink *Auto Confirm User* aan.
2. **Table Editor → profiles**: zoek die persoon en zet `rol` op `slager`.
3. Inloggen op `account.html`, kant **Personeel**.

Iemand die geen personeel meer is: zet `rol` terug op `klant`, of verwijder de
gebruiker bij **Authentication → Users**.

## Bevestigingsmail

Elke klant vult een e-mailadres in. Het echte versturen is **nog niet actief**
(`js/mail.js`): dat komt via een Supabase Edge Function met Resend
(www.resend.com). Daarvoor is een Resend-account met API-sleutel nodig.

## Nog te doen voor de echte versie

- [ ] Echte prijzen en producten in `js/producten.js`
- [ ] Eigen foto's in `images/` (nu voorbeeldfoto's van internet)
- [ ] Bevestigingsmail via Resend activeren
- [ ] Privacyverklaring (we bewaren naam, telefoon en e-mail van klanten)
