
/* ---------- ELEMENTI DELLA PAGINA ---------- */
const darkMode = document.querySelector('#dark-mode');
const form = document.querySelector('#form');
const campo = document.querySelector('#catturato');
const bottone = document.querySelector('#button');
const messaggio = document.querySelector('#msg');
const barra = document.querySelector('#bar');
const contaCatturati = document.querySelector('#conta-catturati');
const contaMancanti = document.querySelector('#conta-mancanti');
const filtro = document.querySelector('#tipi');
const lista = document.querySelector('#list');

const primo_ID = 1;
const ultimo_ID = 493;
const totale = ultimo_ID - primo_ID + 1;
const CHIAVE_SALVATAGGIO = 'catturati';

let catturati = [];
let base = [];
let filtroAttivo = `all`;

/* ---------- MEMORIA DEL BROWSER ---------- */

function caricaDallaMemoria() {
  // 1. Leggiamo il testo salvato con la chiave che abbiamo scelto nelle costanti.
  //    Se la pagina non è mai stata usata, il risultato è null.
  const salvati = localStorage.getItem(CHIAVE_SALVATAGGIO);

  // 2. Controlliamo che ci sia davvero qualcosa.
  //    Se salvati è null, il blocco dentro l'if non viene eseguito
  //    e catturati resta com'è, cioè una lista vuota.
  if (salvati) {
    // 3. Il testo salvato è in formato JSON, cioè una forma scritta
    //    della lista. JSON.parse lo riporta a un array di oggetti.
    catturati = JSON.parse(salvati);
  }
}


function salvaInMemoria() {
  localStorage.setItem(CHIAVE_SALVATAGGIO, JSON.stringify(catturati));
}


/* ---------- RICERCA NEI CATTURATI ---------- */

function trovaCatturato(id) {
  for (let i = 0; i < catturati.length; i++) {
    if (catturati[i].id === id) {
      return catturati[i];
    }
  }
  return undefined
}

/* ---------- POKEAPI ---------- */

async function recuperaPokemon(testo) { // Cerca un singolo Pokémon alla PokeAPI, per nome o numero

  const cercato = testo.trim();

  // Chiediamo la scheda alla PokeAPI e aspettiamo la risposta
  const risposta = await fetch('https://pokeapi.co/api/v2/pokemon/' + cercato);

  // Se risponde con errore, il Pokémon non esiste
  if (!risposta.ok) {
    throw new Error('Pokémon non trovato.');
  }
  // Trasformiamo la risposta in un oggetto
  const dati = await risposta.json();


  return {
    id: dati.id,
    name: dati.name,
    types: dati.types.map(function (t) {
      return t.type.name;
    })
  };
}



async function caricaBase() {
  const address = 'https://pokeapi.co/api/v2/pokemon?offset=' + (primo_ID - 1) + '&limit=' + totale;

  const risposta = await fetch(address);
  const dati = await risposta.json()

  for (let i = 0; i < dati.results.length; i++) {
    const id = primo_ID + i;
    const pokemon = {
      id: id,
      name: dati.results[i].name
    }
    base.push(pokemon);
  }

  creaLista();
}


/* ---------- LISTA PAGINA ---------- */


function creaCard(p, catturato) {
  // Creo la riga 
  const li = document.createElement('li');

  // Creo il numero
  const numero = document.createElement('div');
  numero.className = 'numero';
  numero.textContent = '#' + p.id;

  // Creo il nome
  const nome = document.createElement('div');
  nome.className = 'nome';
  nome.textContent = p.name;

  li.appendChild(numero);
  li.appendChild(nome);

  // Se è catturato, aggiungo i tipi e il pulsante ✕
  if (catturato) {
    li.className = 'catturato';

    // Creo il contenitore dei tipi
    const tipi = document.createElement('div');
    tipi.className = 'tipi';

    // Per ogni tipo creo un badge colorato
    for (let i = 0; i < p.types.length; i++) {
      const tipo = document.createElement('span');
      tipo.className = 'tipo ' + p.types[i];
      tipo.textContent = p.types[i];
      tipi.appendChild(tipo);
    }
    li.appendChild(tipi);

    // // Creo il pulsante ✕ e gli salvo l'id del Pokémon
    // const rimuoviBtn = document.createElement('button');
    // rimuoviBtn.className = 'rimuovi';
    // rimuoviBtn.textContent = '✕';
    // rimuoviBtn.dataset.id = p.id;  // così al click so quale togliere
    // li.appendChild(rimuoviBtn);

  } else {
    li.className = 'fantasma';
  }

  // Restituisco la riga 
  return li;
}


// Ridisegna tutta la lista a partire da base e dai catturati
function creaLista() {
  // Svuoto la lista, così non restano card vecchie
  lista.innerHTML = "";

  // Scorro tutti i Pokémon della generazione
  for (let i = 0; i < base.length; i++) {
    const p = base[i];

    // Cerco il Pokémon tra i catturati.
    // Se lo trovo, 'preso' contiene i suoi dati; altrimenti vale undefined.
    const preso = trovaCatturato(p.id);

    if (preso) {
      // È catturato: uso i dati salvati, che hanno anche i tipi
      lista.appendChild(creaCard(preso, true));
    } else {
      // Non è catturato: uso la riga fantasma
      lista.appendChild(creaCard(p, false));
    }


    // Alla fine aggiorno barra e contatori
    aggiornaContatori();
  }

  function aggiornaContatori() {
    const presi = catturati.length

    const mancanti = totale - presi;

    contaCatturati.textContent = presi;
    contaMancanti.textContent = mancanti;

    barra.style.width = (presi / totale) * 100 + `%`;
  }
}

/* ----------  EVENTI PAGINA ---------- */
// function rimuovi(id) { }


form.addEventListener(`submit`, async function form(e) {
  e.preventDefault();
  bottone.disabled = true;

  const pokemon = await recuperaPokemon(campo.value);

  if (pokemon === null) {
    alert(`Nome del pokemon cercato non valido/ non trovato`);
    return;
  }
  //controllo se appartiene alle generazioni corrette

  if (pokemon.id < primo_ID || pokemon.id > ultimo_ID) {
    alert(pokemon.name + ' non appartiene alle prime quattro generazioni.');
    return;
  }
   catturati.push(pokemon);
  salvaInMemoria();
  creaLista();
  alert(pokemon.name + ' catturato!');
  campo.value = '';
})

darkMode.addEventListener('click', function () {
  // Aggiungo la classe 'notte' al tag <html>, o la tolgo se c'è già
  document.documentElement.classList.toggle('notte');
});



caricaDallaMemoria();
aggiornaContatori();
caricaBase(); 