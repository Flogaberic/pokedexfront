import { Component, HostListener } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { Paginate } from "../../shared/interfaces/paginate";
import { Pokemon } from "../../shared/interfaces/pokemon";

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent {

  pokemonList?: Paginate<Pokemon>;
  isLoading: boolean = false; // Ajoute un indicateur pour empêcher le double chargement
  hasMorePages: boolean = true; // Indique s'il y a encore des pages à charger

  pokemon!: Pokemon;

  private readonly TYPE_NAMES: { [key: number]: string } = {
    1: 'normal',
    2: 'fighting',
    3: 'flying',
    4: 'poison',
    5: 'ground',
    6: 'rock',
    7: 'bug',
    8: 'ghost',
    9: 'steel',
    10: 'fire',
    11: 'water',
    12: 'grass',
    13: 'electric',
    14: 'psychic',
    15: 'ice',
    16: 'dragon',
    17: 'dark',
    18: 'fairy',
    19: 'stellar'
  };

  private readonly TYPE_COLORS: { [key: string]: string } = {
    normal: '#A8A77A',
    fighting: '#C22E28',
    flying: '#A98FF3',
    poison: '#A33EA1',
    ground: '#E2BF65',
    rock: '#B6A136',
    bug: '#A6B91A',
    ghost: '#735797',
    steel: '#B7B7CE',
    fire: '#EE8130',
    water: '#6390F0',
    grass: '#7AC74C',
    electric: '#F7D02C',
    psychic: '#F95587',
    ice: '#96D9D6',
    dragon: '#6F35FC',
    dark: '#705746',
    fairy: '#D685AD',
    stellar: '#E2E2E2' 
  };

  getTypeNames(): string[] {
    if (!this.pokemon || !this.pokemon.default_variety.types) {
      return [];
    }

    // Map les numéros de types aux noms des types
    return this.pokemon.default_variety.types.map((type: any) => this.TYPE_NAMES[type.id]);
  }

  getBackgroundStyle(): string {
    const types = this.getTypeNames();

    if (types.length === 1) {
      // Un seul type, couleur unie
      return this.TYPE_COLORS[types[0]];
    } else if (types.length === 2) {
      // Deux types, appliquer un dégradé
      const color1 = this.TYPE_COLORS[types[0]];
      const color2 = this.TYPE_COLORS[types[1]];
      return `linear-gradient(to right, ${color1}, ${color2})`;
    }
    return '';
  } 


  constructor(
    public apiService: ApiService,
  ) {
    this.loadNextPokemonPage();
  }

  // Fonction pour charger la page suivante des pokémons
  loadNextPokemonPage() {
    // On vérifie qu'une requête n'est pas déjà en cours ou qu'on n'a pas atteint la dernière page
    if (this.isLoading || !this.hasMorePages) {
      return;
    }

    this.isLoading = true; // Empêche de lancer une nouvelle requête avant la fin de la précédente

    // On crée le numéro de la page à charger
    let page = 1;
    if (this.pokemonList) {
      page = this.pokemonList.current_page + 1;
    }

    // On charge la page si elle existe
    this.apiService.requestApi('/pokemon', 'GET', {page: page}).then((pokemons: Paginate<Pokemon>) => {
      console.log(`Chargement de la page : ${page}`, pokemons); // Log pour vérifier la page

      // On vérifie si l'API renvoie bien la page demandée
      if (pokemons.current_page === page) {
        if (!this.pokemonList) {
          this.pokemonList = pokemons;
        } else {
          let datas = this.pokemonList.data.concat(pokemons.data);
          this.pokemonList = { ...pokemons, data: datas };
        }

        // Vérifie si c'était la dernière page
        this.hasMorePages = pokemons.current_page < pokemons.last_page;
      }

      this.isLoading = false; // Requête terminée
    }).catch(error => {
      console.error('Erreur lors de la requête API', error);
      this.isLoading = false; // Libère le flag en cas d'erreur
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;

    // Si l'utilisateur est proche du bas de la page
    if (scrollPosition >= documentHeight - 500) {
      this.loadNextPokemonPage(); // Charge la page suivante
    }
  }
}


