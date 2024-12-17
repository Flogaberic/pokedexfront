import { Component } from '@angular/core';
import { Pokemon } from "../../shared/interfaces/pokemon";
import { ApiService } from "../../shared/services/api.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { PokemonEvolution } from "../../shared/interfaces/pokemon-evolution";
import { Type } from "../../shared/interfaces/type";
import { Ability } from "../../shared/interfaces/ability";
import { PokemonVariety } from '../../shared/interfaces/pokemon-variety';



@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss'
})
export class PokemonDetailComponent {

  pokemon!: Pokemon;
  pokemonEvolutions!: PokemonEvolution;
  abilities!: Ability[];
  types!: Type[];

  private readonly TYPE_COLORS_TOP: { [key: string]: string } = {
    normal: '#FFFCDF',
    fighting: '#C22E28',
    flying: '#A98FF3',
    poison: '#B567CE',
    ground: '#E0AE94',
    rock: '#B6A136',
    bug: '#C3E67B',
    ghost: '#735797',
    steel: '#8DB0BD',
    fire: '#DC2800',
    water: '#9FC3E9',
    grass: '#CAF0C6',
    electric: '#F7D02C',
    psychic: '#FCB7BB',
    ice: '#5090D6',
    dragon: '#277ECB',
    dark: '#5A5465',
    fairy: '#D685AD',
    stellar: '#E2E2E2' 
  };

  private readonly TYPE_COLORS_BOTTOM: { [key: string]: string } = {
      normal: '#F4D23C',
      fighting: '#C22E2850',
      flying: '#A98FF350',
      poison: '#674C70',
      ground: '#DA7D4C',
      rock: '#B6A13650',
      bug: '#91C12F',
      ghost: '#735797',
      steel: '#568293',
      fire: '#FF9D55',
      water: '#5090D6',
      grass: '#63BC5A',
      electric: '#F7D02C',
      psychic: '#FA7179',
      ice: '#5090D6',
      dragon: '#093052',
      dark: '#1F1C23',
      fairy: '#D685AD',
      stellar: '#E2E2E2' 
  };

  shadeColor(color: string, percent: number): string {
      let R = parseInt(color.substring(1, 3), 16);
      let G = parseInt(color.substring(3, 5), 16);
      let B = parseInt(color.substring(5, 7), 16);
      
      R = Math.floor(R * (100 + percent) / 100);
      G = Math.floor(G * (100 + percent) / 100);
      B = Math.floor(B * (100 + percent) / 100);
      
      R = (R < 255) ? R : 255;
      G = (G < 255) ? G : 255;
      B = (B < 255) ? B : 255;
      
      const RR = (R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16);
      const GG = (G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16);
      const BB = (B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16);
      
      return "#" + RR + GG + BB;
  }

  getBackgroundStyle(): string {
  if (this.pokemon && this.pokemon.default_variety && this.pokemon.default_variety.types) {
      const types = this.pokemon.default_variety.types.map((type: any) => type.name.toLowerCase());

      const color1 = this.TYPE_COLORS_TOP[types[0]];
      const color2 = this.TYPE_COLORS_BOTTOM[types[0]];
      return `linear-gradient(to bottom, ${color1}, ${color2})`;
  }
  return '#FFFFFF';
  }



  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Récupération de l'identifiant du Pokémon dans l'URL
    this.route.params.subscribe(params => {
      if (params['pokemon_id']) {
        // Appel de l'API pour récupérer les informations du Pokémon
        this.apiService.requestApi(`/pokemon/${params['pokemon_id']}`)
            .then((response: Pokemon) => {
              this.pokemon = response;
            });

        this.apiService.requestApi(`/evolutions/${params['pokemon_id']}`)
            .then((response: PokemonEvolution) => {
              this.pokemonEvolutions = response;
              console.log('Evolutions :', this.pokemonEvolutions);
            });

        this.apiService.requestApi(`/ability/${params['pokemon_id']}`)
            .then((data: Ability[]) => {
              this.abilities = data; // Assure-toi que c'est bien un tableau
              console.log('Donnée API :', this.abilities);
            });

        this.apiService.requestApi(`/type/`)
            .then((data: Type[]) => {
              this.types = data; // Assure-toi que c'est bien un tableau
              console.log('Types :', this.types);
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

  redirectToHome(){
    this.router.navigate(['/']);
  }
}
