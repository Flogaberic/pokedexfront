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


