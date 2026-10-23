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



// Legge i catturati salvati nel browser 
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

let catturati = [];
let base = [];
let filtroAttivo = `all`;

function salvaInMemoria() {
  localStorage.setItem(CHIAVE_SALVATAGGIO, JSON.stringify(catturati));
}

function trovaCatturato(id) {
  for (let i = 0; i < catturati.length; i++) {
    if (catturati[i].id === id) {
     return catturati[i];
    }
  }
  return undefined
}


// Cerca un singolo Pokémon alla PokeAPI, per nome o numero
async function recuperaPokemon(testo) {
  //togliamo gli spazi ai lati
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
  const address = 'https://pokeapi.co/api/v2/pokemon?offset=' + ( primo_ID - 1) + '&limit=' + totale;

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

function creaLista() {
  lista.innerHTML = "";
  for (let i = 0; i < base.length; i++) {
    const p = base[i];

    const pokemonLi = document.createElement(`li`);
    pokemonLi.classList.add(`li`, `fantasma`);
    pokemonLi.textContent = `#${p.id}  ${p.name}`; 
    lista.appendChild(pokemonLi);
  }
}

caricaDallaMemoria();
caricaBase();
