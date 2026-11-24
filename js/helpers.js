// Kleine hulpfuncties die op meerdere pagina's gebruikt worden.
window.Bouzian = window.Bouzian || {};

Bouzian.helpers = {
  // Element zoeken op id
  $(id) {
    return document.getElementById(id);
  },

  // 12.5 -> "€12,50"
  euro(bedrag) {
    return '€' + bedrag.toFixed(2).replace('.', ',');
  },

  // Tekst van klanten veilig maken voor in HTML (beschermt tegen ingevoerde code)
  esc(tekst) {
    return String(tekst).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  },

  // Stapgrootte van + en −
  stap(product) {
    return product.unit === 'kg' ? 0.5 : 1;
  },

  // 1.5 kg -> "1,5 kg" en 2 stuk -> "2 stuks"
  hoeveelheid(product, aantal) {
    if (product.unit === 'kg') return aantal.toString().replace('.', ',') + ' kg';
    return aantal + (aantal === 1 ? ' stuk' : ' stuks');
  }
};
