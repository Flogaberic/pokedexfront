import { Component } from '@angular/core';
import { Pokemon } from "../../shared/interfaces/pokemon";
import { ApiService } from "../../shared/services/api.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss'
})
export class PokemonDetailComponent {

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
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    // Récupération de l'identifiant du Pokémon dans l'URL
    this.route.params.subscribe(params => {
      if (params['pokemon_id']) {
        // Appel de l'API pour récupérer les informations du Pokémon
        this.apiService.requestApi(`/pokemon/${params['pokemon_id']}`)
            .then((response: Pokemon) => {
              this.pokemon = response;
            });
      }
    });
  }

  playSound() {
    if (this.pokemon && this.pokemon.default_variety.cry_url) {
      const audio = new Audio();
      audio.src = this.pokemon.default_variety.cry_url; // Utilisation de l'URL du son du Pokémon
      audio.load();
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture du son :', error);
      });
    } else {
      console.error('Aucune URL de son trouvée pour ce Pokémon');
    }
  }
}
