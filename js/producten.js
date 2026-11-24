// Productenlijst. Wordt getoond op de homepage (aanbod) én op de bestelpagina.
// Voeg een product toe door een regel te kopiëren. Producten met dezelfde
// categorie (cat) moeten onder elkaar staan.
// unit: 'kg' (per halve kilo te bestellen) of 'stuk'.
// id: uniek, kleine letters, niet meer veranderen (de slager gebruikt het voor 'uitverkocht').
// LET OP: dit zijn voorbeeldprijzen, vraag de echte prijzen na bij de slager.
window.Bouzian = window.Bouzian || {};

Bouzian.producten = [
  // Rundvlees
  { id: 'steak',       cat: 'Rundvlees',   name: 'Steak',                         price: 27.50, unit: 'kg' },
  { id: 'entrecote',   cat: 'Rundvlees',   name: 'Entrecote',                     price: 32.50, unit: 'kg' },
  { id: 'rosbief',     cat: 'Rundvlees',   name: 'Rosbief',                       price: 26.00, unit: 'kg' },
  { id: 'stoof',       cat: 'Rundvlees',   name: 'Stoofvlees',                    price: 18.90, unit: 'kg' },
  { id: 'ribben',      cat: 'Rundvlees',   name: 'Runderribben',                  price: 14.50, unit: 'kg' },
  { id: 'gehakt',      cat: 'Rundvlees',   name: 'Gehakt (rund)',                 price: 13.50, unit: 'kg' },
  { id: 'kefta',       cat: 'Rundvlees',   name: 'Kefta (gekruid gehakt)',        price: 14.90, unit: 'kg' },

  // Lamsvlees
  { id: 'lamskot',     cat: 'Lamsvlees',   name: 'Lamskoteletten',                price: 26.00, unit: 'kg' },
  { id: 'lamsbout',    cat: 'Lamsvlees',   name: 'Lamsbout',                      price: 21.50, unit: 'kg' },
  { id: 'lamsschouder',cat: 'Lamsvlees',   name: 'Lamsschouder',                  price: 19.50, unit: 'kg' },
  { id: 'lamstajine',  cat: 'Lamsvlees',   name: 'Lamsvlees voor tajine',         price: 19.90, unit: 'kg' },
  { id: 'lamsgehakt',  cat: 'Lamsvlees',   name: 'Lamsgehakt',                    price: 17.50, unit: 'kg' },

  // Kip
  { id: 'kiphel',      cat: 'Kip',         name: 'Hele kip',                      price:  9.50, unit: 'stuk' },
  { id: 'kipfilet',    cat: 'Kip',         name: 'Kippenfilet',                   price: 12.90, unit: 'kg' },
  { id: 'kipbout',     cat: 'Kip',         name: 'Kippenboutjes',                 price:  7.50, unit: 'kg' },
  { id: 'kipdrum',     cat: 'Kip',         name: 'Drumsticks',                    price:  6.90, unit: 'kg' },
  { id: 'kipvleugel',  cat: 'Kip',         name: 'Kippenvleugels',                price:  6.50, unit: 'kg' },
  { id: 'kipgehakt',   cat: 'Kip',         name: 'Kippengehakt',                  price: 11.50, unit: 'kg' },

  // Barbecue & gemarineerd
  { id: 'merguez',     cat: 'Barbecue & gemarineerd', name: 'Merguez',                     price: 15.90, unit: 'kg' },
  { id: 'brochette',   cat: 'Barbecue & gemarineerd', name: 'Kipbrochettes (gemarineerd)', price:  2.20, unit: 'stuk' },
  { id: 'lamsbroch',   cat: 'Barbecue & gemarineerd', name: 'Lamsbrochettes',              price:  3.20, unit: 'stuk' },
  { id: 'keftabroch',  cat: 'Barbecue & gemarineerd', name: 'Keftabrochettes',             price:  2.50, unit: 'stuk' },
  { id: 'vleugelmar',  cat: 'Barbecue & gemarineerd', name: 'Gemarineerde kippenvleugels', price:  8.90, unit: 'kg' },

  // Charcuterie
  { id: 'sucuk',       cat: 'Charcuterie', name: 'Sucuk',                         price: 19.90, unit: 'kg' },
  { id: 'kalkoenham',  cat: 'Charcuterie', name: 'Kalkoenfilet (beleg)',          price: 18.50, unit: 'kg' },
  { id: 'pastrami',    cat: 'Charcuterie', name: 'Pastrami (rund)',               price: 29.90, unit: 'kg' }
];
