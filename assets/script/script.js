/* ===== ELEMENTI DELLA PAGIN ===== */

const darkMode = document.querySelector('#dark-mode');
const form = document.querySelector('#form');
const campo = document.querySelector('#catturato');
const barra = document.querySelector('#bar');
const contaCatturati = document.querySelector('#conta-catturati');
const contaMancanti = document.querySelector('#conta-mancanti');
const statoSelect = document.querySelector('#stato');
const filtro = document.querySelector('#tipi');
const lista = document.querySelector('#list');

const primo_ID = 1;                       // primo indice del Pokedex
const ultimo_ID = 493;                    // ultimo indice del Pokedex
const totale = ultimo_ID - primo_ID + 1;
const CHIAVE_SALVATAGGIO = 'catturati';   // nome con cui salvo nel browser


/* ===== DATI ===== */

let base = [];
let catturati = [];


/* ===== MEMORIA DEL BROWSER ===== */

// Legge i catturati salvati
function caricaDallaMemoria() {
  const salvati = localStorage.getItem(CHIAVE_SALVATAGGIO); // testo salvato
  if (salvati) {                      // se c'è qualcosa
    catturati = JSON.parse(salvati);  // diventa lista
  }
}

// Salva catturati
function salvaInMemoria() {
  localStorage.setItem(CHIAVE_SALVATAGGIO, JSON.stringify(catturati));
}


/* ===== RICERCA ===== */

// Cerca il Pokémon per nome o id. 
function trovaId(testo) {
  const cercato = testo.trim()
  for (let i = 0; i < base.length; i++) {      // scorto i Pokémon
    // confronto con il nome, oppure con il numero scritto come testo
    if (base[i].name === cercato || String(base[i].id) === cercato) {
      return base[i].id;  //restituisco il numero
    }
  }
  return 0;
}

// Cerca tra i catturati per id.
function trovaCatturato(id) {
  for (let i = 0; i < catturati.length; i++) {
    if (catturati[i].id === id) {
      return catturati[i];
    }
  }
  return undefined;
}


/* ===== CARICAMENTO POKEAPI ===== */

// Scarica la lista dei Pokémon con una sola richiesta
function caricaBase() {
  // offset = da quale posizione partire, limit = quanti Pokémon prendere
  const indirizzo = 'https://pokeapi.co/api/v2/pokemon?offset=' + (primo_ID - 1) + '&limit=' + totale;

  fetch(indirizzo)                              // chiedo la lista
    .then(function (risposta) {
      return risposta.json();                   // traformo la risposta in oggetto
    })
    .then(function (dati) {
      for (let i = 0; i < dati.results.length; i++) {
        base.push({
          id: primo_ID + i,
          name: dati.results[i].name
        });
      }
      creaLista();
    })
    .catch(function () {
      alert('Impossibile caricare la lista dei Pokémon.');
    });
}


/* ===== AZIONI ===== */

// Cattura un Pokémon
function catturaPokemon(id) {
  const nome = base[id - primo_ID].name;      // il nome lo prendo dalla lista base

  fetch('https://pokeapi.co/api/v2/pokemon/' + id)   // chiedo la scheda di questo Pokémon
    .then(function (risposta) {
      return risposta.json();
    })
    .then(function (dati) {
      const tipi = [];
      for (let i = 0; i < dati.types.length; i++) {
        tipi.push(dati.types[i].type.name);   // prendo il nome tipo
      }

      catturati.push({
        id: id,
        name: nome,
        types: tipi
      }
      );
      salvaInMemoria();                       // salvo nel browser
      creaLista();
      alert(nome + ' catturato');            // messaggio di conferma
      campo.value = '';                       // svuoto il campo
    })
    .catch(function () {
      alert('Errore di connessione, riprova.');
    });
}


/* ===== CATTURATI/ DA CATTURARE ===== */

function passaFiltri(preso) {
  const statoScelto = statoSelect.value;      // di default è"tutti"

  if (statoScelto === 'catturati' && !preso) {
    return false;
  }
  if (statoScelto === 'mancanti' && preso) {
    return false;
  }
   return true;  
}


// Crea la riga di ogni Pokémon.
// catturato = true per i presi (con tipi e ✕), false per quelli da prendere
function creaCard(p, catturato) {
  const li = document.createElement('li');    // creo la riga

  const numero = document.createElement('div');
  numero.classList.add('numero');
  numero.textContent = '#' + p.id;            
  li.appendChild(numero);

  const nome = document.createElement('div');
  nome.classList.add('nome');
  nome.textContent = p.name;                  // es. pikachu
  li.appendChild(nome);

  if (catturato) {
    li.classList.add('catturato');            
    const tipi = document.createElement('div');

    tipi.classList.add('tipi');
    for (let i = 0; i < p.types.length; i++) {
      const tipo = document.createElement('span');
      tipo.classList.add('tipo' , p.types[i]);  
      tipo.textContent = p.types[i];
      tipi.appendChild(tipo);
    }
    li.appendChild(tipi);

    const btnRimuovi = document.createElement('button');
    btnRimuovi.classList.add ('rimuovi');
    btnRimuovi.textContent = '✕';
    li.appendChild(btnRimuovi);

  } else {
    li.classList.add('fantasma');                // stile sbiadito
  }
  
  return li;
}

// Creo la lista
function creaLista() {
  lista.innerHTML = '';                       // la svuoto

  for (let i = 0; i < base.length; i++) {     
    const p = base[i];
    const preso = trovaCatturato(p.id);       // cerco se è tra i catturati

    // controllo se è catturato, ed in base a ciò creo la  lista
    if (passaFiltri(preso)) {                 
      if (preso) {
        lista.appendChild(creaCard(preso, true));  
      } else {
        lista.appendChild(creaCard(p, false));    
      }
    }
  }
  aggiornaContatori();                        // aggiorno numeri e barra
}

// Aggiorna i contaotri e la barra del progresso
function aggiornaContatori() {
  const presi = catturati.length;             
  contaCatturati.textContent = presi;
  contaMancanti.textContent = totale - presi; // quanti ne mancano
  barra.style.width = (presi / totale) * 100 + '%';
}


/* ===== EVENTI ===== */

// Submit form
form.addEventListener('submit', function (evento) {
  evento.preventDefault();                    // blocco il ricaricamento della pagina

  const id = trovaId(campo.value);     // cerco nella lista base
  if (id === 0) {                             
    alert('Pokémon non trovato.');
    return;
  }

  if (trovaCatturato(id)) {                   
    alert('Questo Pokémon è già nella tua Pokédex!');
    return;
  }

  catturaPokemon(id);                         
});

// aggiungo o tolgo la classe 'notte'
darkMode.addEventListener('click', function () {
  document.documentElement.classList.toggle('notte');
});

// Cambio dello stato: ridisegno la lista
statoSelect.addEventListener('change', function () {
  creaLista();
});



caricaDallaMemoria();
aggiornaContatori();
caricaBase();           