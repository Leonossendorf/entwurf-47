(function(){
  var form = document.getElementById('feierform');
  var slider = document.getElementById('gaeste');
  var zahl = document.getElementById('gaeste-zahl');
  var tipp = document.getElementById('raumtipp');

  function weg(){ var r = form.querySelector('input[name=weg]:checked'); return r ? r.value : 'saal'; }

  function raumTipp(){
    var n = +slider.value;
    zahl.textContent = n + (n >= 130 && weg() === 'saal' ? '' : '');
    if (weg() === 'catering') {
      tipp.innerHTML = n > 120
        ? 'Für <strong>mehr als 120 Gäste</strong> sprechen wir das Catering gern persönlich mit Ihnen ab.'
        : 'Catering für <strong>' + n + ' Gäste</strong>: Wir liefern zu Ihnen, Buffet oder Menü.';
      return;
    }
    var raum;
    if (n <= 14) raum = '<strong>Clubzimmer</strong>, am großen Tisch für bis zu 14 Gäste.';
    else if (n <= 50) raum = '<strong>Kaminzimmer</strong>, für 20 bis 50 Gäste, im Winter mit Feuer.';
    else raum = '<strong>Festsaal</strong>, mit Tanzfläche und Thekenecke, bis 130 Gäste.';
    tipp.innerHTML = 'Für ' + n + ' Gäste passt das ' + raum;
  }

  function setzeWeg(w){
    var r = form.querySelector('input[name=weg][value=' + w + ']');
    if (r) { r.checked = true; }
    form.classList.toggle('catering-weg', w === 'catering');
    slider.max = w === 'catering' ? 150 : 130;
    raumTipp();
  }

  form.addEventListener('change', function(e){
    if (e.target.name === 'weg') setzeWeg(e.target.value);
  });
  slider.addEventListener('input', raumTipp);
  setzeWeg('saal');

  // Links und Knöpfe, die eine Weiche vorwählen
  document.querySelectorAll('[data-weg]').forEach(function(a){
    a.addEventListener('click', function(){ setzeWeg(a.getAttribute('data-weg')); });
  });
  // Anlass-Knöpfe unter den Räumen wählen den Anlass vor
  document.querySelectorAll('[data-anlass]').forEach(function(b){
    b.addEventListener('click', function(){
      setzeWeg('saal');
      var r = form.querySelector('input[name=anlass][value="' + b.getAttribute('data-anlass') + '"]');
      if (r) r.checked = true;
      document.getElementById('anfrage').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    });
  });

  // Absenden (Demo)
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var feld = document.getElementById('rueckweg');
    var box = feld.parentNode;
    var alt = box.querySelector('.fehlertext'); if (alt) alt.remove();
    box.classList.remove('fehler');
    if (!feld.value.trim()) {
      box.classList.add('fehler');
      var p = document.createElement('p'); p.className = 'fehlertext'; p.id = 'rueckweg-fehler';
      p.textContent = 'Bitte eine Telefonnummer oder E-Mail-Adresse angeben, damit wir antworten können.';
      box.appendChild(p); feld.setAttribute('aria-describedby', 'rueckweg-hilfe rueckweg-fehler'); feld.focus();
      return;
    }
    var a = form.querySelector('input[name=anlass]:checked');
    var d = document.getElementById('datum').value;
    var datum = d ? new Date(d + 'T12:00').toLocaleDateString('de-DE', {weekday:'long', day:'numeric', month:'long', year:'numeric'}) : 'noch offen';
    var w = weg();
    var zeilen = [
      ['Art', w === 'catering' ? 'Catering außer Haus' : 'Feier bei Pötter'],
      ['Anlass', a ? a.value : 'nicht angegeben'],
      ['Termin', datum],
      ['Gäste', slider.value]
    ];
    if (w === 'catering' && document.getElementById('ort').value.trim()) zeilen.push(['Ort', document.getElementById('ort').value.trim()]);
    var out = document.getElementById('bestaetigung');
    var html = '<h3>Danke, Ihre Anfrage ist angekommen.</h3><dl>';
    zeilen.forEach(function(z){ html += '<dt>' + z[0] + '</dt><dd>' + z[1].toString().replace(/</g,'&lt;') + '</dd>'; });
    html += '</dl><p>So sähe die Bestätigung in der fertigen Seite aus. Familie Pötter bekäme die Anfrage sortiert per E-Mail und meldet sich mit Vorschlägen für Raum und Menü. Im Entwurf wird nichts versendet.</p>';
    out.innerHTML = html; out.hidden = false; out.focus();
  });

  // Kurzformular im Fuß (Demo)
  var kf = document.getElementById('kurzform');
  kf.addEventListener('submit', function(e){
    e.preventDefault();
    var f = document.getElementById('kf-weg');
    if (!f.value.trim()) { f.focus(); f.setAttribute('aria-invalid','true'); return; }
    f.removeAttribute('aria-invalid');
    document.getElementById('kf-ok').hidden = false;
  });

  // Demo-Fenster
  function oeffne(id){ var d = document.getElementById(id); if (d && d.showModal) d.showModal(); }
  document.querySelectorAll('[data-open]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      oeffne('fenster-' + el.getAttribute('data-open'));
    });
  });
  document.querySelectorAll('[data-unterseite]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      var n = el.getAttribute('data-unterseite');
      document.getElementById('fu-titel').textContent = n;
      document.getElementById('fu-text').textContent = n === 'Speisekarte'
        ? 'Hier steht in der fertigen Seite immer die aktuelle Speisekarte, lesbar auf dem Handy. Eine kurze Nachricht an mich genügt, und ich tausche sie aus.'
        : 'Die Seite „' + n + '“ baue ich nach unserem Gespräch aus, mit allen Zimmerarten und Bildern.';
      oeffne('fenster-unterseite');
    });
  });
  var pr = document.getElementById('fb-pruefen');
  if (pr) pr.addEventListener('click', function(){
    var h = document.getElementById('fb-hinweis');
    h.textContent = 'Entwurf: In der fertigen Seite erscheinen hier jetzt die freien Zimmer aus Ihrem Buchungssystem DIRS21, mit Preis und Buchen-Knopf.';
    h.style.background = '#fbf3dc';
  });
  // Vorbelegung der Buchung: heute und morgen
  var an = document.getElementById('fb-an'), ab = document.getElementById('fb-ab');
  if (an && ab) {
    var t = new Date(), m = new Date(Date.now() + 864e5);
    var f = function(x){ return x.toISOString().slice(0,10); };
    an.value = f(t); ab.value = f(m); an.min = f(t);
  }

  // Ruhiges Einblenden beim Scrollen
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var els = document.querySelectorAll('.zimmer-bilder,.zimmer-text,.raum,.formular,.catering-bild,.catering-text,.restaurant-text,.restaurant-bilder,.familie-kopf,.jahre li,.anfahrt > *');
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('da'); io.unobserve(en.target); } });
    }, {rootMargin: '0px 0px -8% 0px'});
    els.forEach(function(el, i){ el.classList.add('zeig'); el.style.transitionDelay = (el.matches('.jahre li') ? (i % 7) * 70 : 0) + 'ms'; io.observe(el); });
  }
})();
