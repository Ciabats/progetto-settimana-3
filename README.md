# progetto-settimana-3

POKEDEX

Ho realizzato un Pokedex mediante l'uso di HTML/CSS/JavaScript che mostra i Pokémon dalla prima alla quarta generazione e ti permette di registrare quelli catturati che poi possono essere visualizzati attraverso l'uso di filtri(ad esempio, visualizzare solo quelli catturati o quelli ancora da catturare). I dati arrivano dalla [PokeAPI](https://pokeapi.co/).

Cosa fa:
- Lista dei 493 Pokémon: quelli non catturati sono sbiaditi, quelli catturati sono colorati e mostrano i tipi
- Registra catture: scrivi il nome del pokemon e premi  il button"Registra"
- Contatori di catturati e mancanti, con una progress-bar che fa vedere lo stato di completamento
- Filtro per stato: tutti, solo catturati, da catturare //per ora è solo un tag select senza la funzione filtro
- Salvataggio automatico nel browser: i catturati restano anche dopo aver ricaricato la pagina tramite l'uso di localStoragevc
- Pulsante "Dark mode" per la modalità notte

Funzionamento
- All'avvio,scarica la lista dei 493 Pokémon con una richiesta alla PokeAPI.
- Scrivi un nome o un numero e premi "Registra".
- Se il Pokémon esiste e non è ancora preso, l'app chiede alla PokeAPI i suoi tipi e lo salva.
- Ogni cattura aggiorna la lista, i contatori e la barra.
- I catturati vengono salvati nel browser (`localStorage`), quindi restano anche dopo aver ricaricato la pagina.

Crediti
- Dati dei Pokémon: [PokeAPI](https://pokeapi.co/).
