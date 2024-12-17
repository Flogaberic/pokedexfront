import { Component, HostListener } from '@angular/core';
import { Renderer2, OnInit } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { Paginate } from "../../shared/interfaces/paginate";
import { Pokemon } from "../../shared/interfaces/pokemon";
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { Type } from "../../shared/interfaces/type";


@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})

export class PokemonListComponent implements OnInit {

  pokemonList?: Paginate<Pokemon>;
  isLoading: boolean = false; // Ajoute un indicateur pour empêcher le double chargement
  hasMorePages: boolean = true; // Indique s'il y a encore des pages à charger
  searchQuery = '';
  allPokemon: Pokemon[] = [];
  pokemon!: Pokemon;
  types!: Type[];
  

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

  getTypeNames(): string[] {
    if (!this.pokemon || !this.pokemon.default_variety.types) {
      return [];
    }

    // Map les numéros de types aux noms des types
    return this.pokemon.default_variety.types.map((type: any) => this.TYPE_NAMES[type.id]);
  }

  isDarkMode = false;

  constructor(
    public apiService: ApiService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loadNextPokemonPage();

    this.route.params.subscribe(params => {
        this.apiService.requestApi(`/type/`)
            .then((data: Type[]) => {
              this.types = data; // Assure-toi que c'est bien un tableau
              console.log('Types :', this.types);
            });
        })
  }

  ngOnInit(): void {
    const darkModeSetting = localStorage.getItem('dark-mode');
    if (darkModeSetting === 'true') {
      this.isDarkMode = true;
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      localStorage.setItem('dark-mode', 'true');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      localStorage.setItem('dark-mode', 'false');
    }
  }

  filteredPokemonList() {
    // Si la recherche est vide, retourne tous les Pokémon
    if (!this.searchQuery.trim()) {
      return this.allPokemon;
    }
    
    // Applique le filtre à la liste complète des Pokémon
    return this.allPokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  trackById(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }
  
  async loggingout() {
    await this.apiService.logout();
  }

  loadNextPokemonPage() {
    if (this.isLoading || !this.hasMorePages) {
      return;
    }
  
    this.isLoading = true;
    let page = 1;
  
    if (this.pokemonList) {
      page = this.pokemonList.current_page + 1;
    }
  
    this.apiService.requestApi('/pokemon', 'GET', { page: page }).then((pokemons: Paginate<Pokemon>) => {
      if (pokemons.current_page === page) {
        if (!this.pokemonList) {
          this.pokemonList = pokemons;
          this.allPokemon = pokemons.data; // Initialise la liste complète
        } else {
          let datas = this.pokemonList.data.concat(pokemons.data);
          this.pokemonList = { ...pokemons, data: datas };
          this.allPokemon = [...this.allPokemon, ...pokemons.data]; // Ajoute les nouveaux Pokémon
        }
  
        this.hasMorePages = pokemons.current_page < pokemons.last_page;
      }
  
      this.isLoading = false;
    }).catch(error => {
      console.error('Erreur lors de la requête API', error);
      this.isLoading = false;
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


